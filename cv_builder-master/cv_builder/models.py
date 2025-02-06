from django.db import models


# The model to store all the CVs as JSON
class CV(models.Model):
    name = models.CharField(max_length=100)
    json = models.JSONField()

