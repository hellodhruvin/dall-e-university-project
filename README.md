# Image Generation, Variation and Templating with Dall-E and Fabric

## Prerequisites:

### Frontend:

[Install pnpm](https://pnpm.io/installation) - This is the package manager we
are using. Using it instead of npm because it saves disk space (this could go
upto 10s of gigabytes because node_modules grows huge pretty fast).

Navigate to dalle-gui directory and execute:
```
pnpm install
```

### Backend:

[Install Python](https://www.python.org/downloads/windows/) - Click the text
that says "Latest Python 3 Release - ...." Make sure you check the add to PATH
options when installing for pip as well as python. DO NOT DOWNLOAD PYTHON FROM
MICROSOFT STORE.

[Install pipx](https://pipx.pypa.io/stable/installation/#on-windows) - Use the
pip install method and not the scoop method. This is requried to install
poetry.

[Install Poetry](https://python-poetry.org/docs/#installing-with-pipx) - This
is a package manager that also handles the venv and stuff so we don't have to.
And it stores packages in a format better than "txt". Note: There is also an
"official" installer for installing this but I prefer pipx because that's the
go-to way to install python cli applications and poetry is a python cli
application.

Navigate to dalle-core directory and execute:
```
poetry install
```

A .env file with OPENAI_API_KEY env variable set (Set this to a >1 character
string if you want to use the app in testing mode).

If you set the TESTING_NO_IMAGEGEN variable to True (it's near the top of the
file) it won't use openai and send template images so we don't use credits when
we are just testing the app.

## Running the code:

### Frontend

```
pnpm run dev
```

### Backend

```
poetry run fastapi dev
```
