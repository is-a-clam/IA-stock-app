# Generated by Django 3.2 on 2021-08-28 19:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('graph', '0012_auto_20210828_1914'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='stocks',
            field=models.JSONField(),
        ),
    ]
