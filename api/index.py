# Vercel Python Function entrypoint for the Flask app
# Exposes the Flask WSGI application as `app`

import sys
import os

# Add parent directory to sys.path so app.py can be imported on Vercel
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app as flask_app

# The name `app` is important for Vercel's Python runtime (WSGI)
app = flask_app
