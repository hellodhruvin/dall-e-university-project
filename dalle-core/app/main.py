import os
from typing import NamedTuple, Union, List
from collections import deque

import openai
from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from openai import Client

from dotenv import load_dotenv

# Just set this to True if you want to generate actual images, or False to just
# use placeholders so that credits don't get consumed when working on front end
TESTING_NO_IMAGEGEN = False

load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if OPENAI_API_KEY is None:
    raise Exception(
        "OPENAI_API_KEY is required. Please make sure it is in Environment Variables."
    )

openai_client = Client(api_key=OPENAI_API_KEY)


@app.get("/")
async def api_status_check():
    return {"Status": "Online"}


@app.post("/variation")
async def api_generate_variation(image: UploadFile):
    try:
        images = (
            await generate_images_dummy("", 1)
            if TESTING_NO_IMAGEGEN
            else await generate_variations(image, 1)
        )

        q = deque()

        for img in images:
            q.append({"url": img.url})

        return {"images": q}
    except openai.OpenAIError as e:
        print(e)
        raise HTTPException(500, "INTERNAL_API_ERROR")


@app.post("/variations")
async def api_generate_variations(image: UploadFile):
    try:
        images = (
            await generate_images_dummy("", 4)
            if TESTING_NO_IMAGEGEN
            else await generate_variations(image, 4)
        )

        q = deque()

        for img in images:
            q.append({"url": img.url})

        return {"images": q}
    except openai.OpenAIError as e:
        print(e)
        raise HTTPException(500, "INTERNAL_API_ERROR")


@app.get("/generate-image")
async def api_generate_image(prompt: Union[str, None] = None):
    """
    API Route to generate an image using a prompt string
    """
    # TODO: Decide on a min length for this variable with the team because
    # obviously no will send a 1 letter prompt for image. Also need a max
    # length to avoid API abuse.
    if prompt is None or len(prompt) < 1:
        raise HTTPException(status_code=429, detail="prompt is required parameter")
    if len(prompt) > 999:
        raise HTTPException(
            status_code=429, detail="prompt is too big. keep it under 1000 characters"
        )

    try:
        images = (
            await generate_images_dummy(prompt, 1)
            if TESTING_NO_IMAGEGEN
            else await generate_single_image(prompt)
        )

        # Don't blame me for this queue, its them who returns an array.
        q = deque()

        # Inline for didn't quite cutout and using queue is fancy so why not.
        for img in images:
            q.append({"url": img.url})

        return {"images": q}
    except openai.OpenAIError as e:
        print(e)
        raise HTTPException(500, "INTERNAL_API_ERROR")


@app.get("/generate-images")
async def api_generate_images(prompt: Union[str, None] = None):
    """
    API Route to generate an image using a prompt string
    """
    # TODO: Decide on a min length for this variable with the team because
    # obviously no will send a 1 letter prompt for image. Also need a max
    # length to avoid API abuse.
    if prompt is None or len(prompt) < 1:
        raise HTTPException(status_code=429, detail="prompt is required parameter")
    if len(prompt) > 999:
        raise HTTPException(
            status_code=429, detail="prompt is too big. keep it under 1000 characters"
        )

    try:
        images = []
        images = (
            await generate_images_dummy(prompt, 4)
            if TESTING_NO_IMAGEGEN
            else await generate_hq_images(prompt, 4)
        )
        # images = await generate_images(prompt, 4)
        # images = await generate_hq_images(prompt, 4)

        q = deque()

        # Inline fot didn't quite cutout and using queue is fancy so why not.
        for img in images:
            q.append({"url": img.url})

        return {"images": q}
    except openai.OpenAIError as e:
        print(e)
        raise HTTPException(500, "INTERNAL_API_ERROR")


# Dummy Testing Code:
class DummyImageData(NamedTuple):
    """
    The only reason this class exists is to satisfy type constraints
    """

    url: str


async def generate_images_dummy(_: str, n: int) -> List[DummyImageData]:
    """
    Function to generate dummy images so that we don't use openai credits unless necessary.
    Needs manual replacement of function calls.
    """
    return [DummyImageData(url="https://via.placeholder.com/1024x1024")] * n


# Only model available is dall-e-2
async def generate_variations(image: UploadFile, n: int):
    """
    Helper function to call Open AI Dall-E to generate variations of an Image
    """
    image_data = await image.read()
    response = openai_client.images.create_variation(
        model="dall-e-2",
        # Not sure if both are same type.
        # image=open("corgi_and_cat_paw.png", "rb"),
        image=image_data,
        n=n,
        size="1024x1024",
    )

    return response.data


# Quality options for dall-e 3: 1024x1024, 1024x1792 or 1792x1024
# Quality options for dall-e 2: 256x256, 512x512, or 1024x1024
# The only overlap is 1024x1024 so going with that.
async def generate_hq_images(prompt: str, n: int):
    q = deque()

    for _ in range(n):
        q.append((await generate_single_image(prompt))[0])

    return q


async def generate_single_image(prompt: str):
    response = openai_client.images.generate(
        prompt=prompt, model="dall-e-3", size="1024x1024", n=1
    )
    """
    Helper function to call Open AI Dall-E to generate the image
    """

    return response.data
