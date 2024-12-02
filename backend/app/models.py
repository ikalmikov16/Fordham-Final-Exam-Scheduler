from django.db import models


class Course(models.Model):
    title = models.CharField(max_length=200)
    major = models.CharField(max_length=100)
    professor = models.CharField(max_length=100)

    major_tag = models.CharField(max_length=4)
    number = models.CharField(max_length=4)
    major_and_number = models.CharField(max_length=9)
    section = models.CharField(max_length=3)
    crn = models.CharField(max_length=5, unique=True)

    location = models.CharField(max_length=50)
    exam_start_time = models.DateTimeField()
    exam_end_time = models.DateTimeField()

    def __str__(self):
        return f"{self.major_tag} {self.number} - {self.section} - {self.crn}"
