# Generated by Django 5.1.6 on 2025-03-14 12:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clients', '0002_client_branch_alter_branch_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='client',
            name='branch',
        ),
        migrations.AlterField(
            model_name='branch',
            name='id',
            field=models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID'),
        ),
    ]
