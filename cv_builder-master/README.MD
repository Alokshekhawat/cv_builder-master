# Computer programming project - CV Builder

### Adrien Didot - Emmanuel Cousin

## Introduction

The aim of the project is to help students in the building, creation and storage of their CV. There is a front-end web
app, displaying the CVs stored in the database, that allows the user to add a new CV, delete, or edit the JSON file to
update their already existing resumes.

The back-end will be a Python API, which will be used to generate the PDF file. We will develop it using the Django
framework. To convert the HTML page into a PDF file, we will use selenium, to make a "print" from Chrome. We used the
functions from the
[python-selenium-chrome-html-to-pdf-converter](https://github.com/maxvst/python-selenium-chrome-html-to-pdf-converter)
repo.

## Installation instructions

### Installing the back-end (Python Django)

1. Clone repository

```bash
git clone https://github.com/Adridot/cv_builder.git
cd cv_builder
```

2. Install and activate a virtual environment

_**WARNING:** you will need to use a python version **>= 3.8**_

```bash
python -m venv venv
source venv/bin/activate
```

3. Install the requirements

```bash
pip install -r requirements.txt
```

4. Collect static files

```bash
python manage.py collectstatic
```

5. Run the server

```bash
python manage.py runserver
```

### Installing the front-end (ReactJS)

1. Go the the frontend directory

```bash
cd frontend
```

2. Install the dependencies

```bash
npm install --force
```

3. Run the server

```bash
npm start
```

### Using the app

Open the front-end website (http://localhost:3000/), and start creating a CV !

