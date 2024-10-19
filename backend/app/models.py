from django.db import models

class Course(models.Model):
    title = models.CharField(max_length=200)
    major = models.CharField(max_length=100)
    professor = models.CharField(max_length=100)

    major_tag = models.CharField(max_length=4)
    number = models.CharField(max_length=4)
    section = models.CharField(max_length=3)
    crn = models.CharField(max_length=5, unique=True)

    location = models.CharField(max_length=10)
    exam_start_time = models.TimeField()
    exam_end_time = models.TimeField()
    exam_date = models.DateField()

    def __str__(self):
        return f"{self.major_tag} {self.number} - {self.section} - {self.crn}"