import pytest
from app import schemas
from .database import client, session
from jose import JWTError, jwt # pyright: ignore[reportMissingModuleSource]
from app.config import settings

