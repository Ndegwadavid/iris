# Generated by Django 5.1.6 on 2025-03-22 12:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_useraccount_role'),
    ]

    operations = [
        migrations.AlterField(
            model_name='useraccount',
            name='is_staff',
            field=models.BooleanField(default=True),
        ),
    ]
