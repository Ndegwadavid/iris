# Generated by Django 5.1.6 on 2025-03-05 13:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='examination',
            name='examined_by',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
