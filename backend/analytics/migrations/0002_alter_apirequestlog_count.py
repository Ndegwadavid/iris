# Generated by Django 5.1.6 on 2025-03-22 13:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('analytics', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='apirequestlog',
            name='count',
            field=models.IntegerField(default=0),
        ),
    ]
