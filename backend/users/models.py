from django.db import models
import uuid
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin

class UserAccountManager(BaseUserManager):
    def create_user(self, email, password=None, role="staff", **kwargs):
        """Creates and saves a User with the given email and password."""
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email).lower()

        user = self.model(
            email=email,
            role=role,
            **kwargs,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **kwargs):
        """Creates and saves a superuser with the given email and password."""
        user = self.create_user(email, password=password, role="staff", **kwargs)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user

class UserAccount(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ("staff", "Staff"),
        ("receptionist", "Receptionist"),
        ("optometrist", "Optometrist"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(verbose_name="email address", max_length=255, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="staff")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = UserAccountManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    def __str__(self):
        return f"{self.email} - {self.role}"
