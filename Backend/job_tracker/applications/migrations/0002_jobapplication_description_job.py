# Generated by Django 5.0.6 on 2024-06-29 22:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('applications', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='jobapplication',
            name='description_job',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
    ]
