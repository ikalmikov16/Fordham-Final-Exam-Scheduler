# Generated by Django 5.1.2 on 2024-10-20 21:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0003_alter_course_location"),
    ]

    operations = [
        migrations.AddField(
            model_name="course",
            name="major_and_number",
            field=models.CharField(default="", max_length=9),
            preserve_default=False,
        ),
    ]
