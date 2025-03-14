# Generated by Django 5.1.6 on 2025-03-05 13:25

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Client',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('dob', models.DateField()),
                ('phone_number', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254)),
                ('location', models.CharField(max_length=100)),
                ('registered_by', models.CharField(max_length=100)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('O', 'Other')], max_length=1)),
                ('previous_prescription', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('last_examination_date', models.DateField(blank=True, null=True)),
                ('visit_count', models.PositiveIntegerField(default=1)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='Examination',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('examination_date', models.DateField(auto_now_add=True)),
                ('examined_by', models.CharField(max_length=100)),
                ('clinical_history', models.TextField(blank=True)),
                ('right_sph', models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=5, null=True)),
                ('right_cyl', models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=5, null=True)),
                ('right_axis', models.IntegerField(blank=True, default=None, null=True)),
                ('right_add', models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=5, null=True)),
                ('right_va', models.CharField(blank=True, default='N/A', max_length=20)),
                ('right_ipd', models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=5, null=True)),
                ('left_sph', models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=5, null=True)),
                ('left_cyl', models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=5, null=True)),
                ('left_axis', models.IntegerField(blank=True, default=None, null=True)),
                ('left_add', models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=5, null=True)),
                ('left_va', models.CharField(blank=True, default='N/A', max_length=20)),
                ('left_ipd', models.DecimalField(blank=True, decimal_places=2, default=None, max_digits=5, null=True)),
                ('state', models.CharField(choices=[('Pending', 'Pending'), ('Completed', 'Completed')], default='Pending', max_length=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('client', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='examinations', to='clients.client')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
