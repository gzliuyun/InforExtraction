from __future__ import unicode_literals

from django.db import models


class Notyperel(models.Model):
    n_id = models.AutoField(primary_key=True)
    sentence = models.CharField(max_length=255, blank=True, null=True)
    name1 = models.CharField(max_length=255, blank=True, null=True)
    name2 = models.CharField(max_length=255, blank=True, null=True)
    r_type = models.CharField(max_length=255, blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):  # __str__ on Python 3
        return self.n_id

    class Meta:
        managed = True
        db_table = 'Notyperel'


class Peoplelist(models.Model):
    p_id = models.AutoField(primary_key=True)
    name = models.CharField(unique=True, max_length=255)
    introduction = models.TextField(blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)
    photo_url = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):  # __str__ on Python 3
        return self.name

    class Meta:
        managed = True
        db_table = 'Peoplelist'


class Peoplerelation(models.Model):
    n_id = models.AutoField(primary_key=True)
    p1_id = models.IntegerField()
    p2_id = models.IntegerField()
    r_id = models.IntegerField()

    def __str__(self):  # __str__ on Python 3
        return self.n_id

    class Meta:
        managed = True
        db_table = 'Peoplerelation'
        unique_together = (('p1_id', 'p2_id','r_id'),)


class Extractedrelation(models.Model):
    n_id = models.AutoField(primary_key=True)
    p1_id = models.IntegerField()
    p2_id = models.IntegerField()
    r_id = models.IntegerField()

    def __str__(self):
        return self.n_id

    class Meta:
        managed = True
        db_table = 'Extractedrelation'
        unique_together = (('p1_id','p2_id','r_id'),)

class Relationlist(models.Model):
    r_id = models.AutoField(primary_key=True)
    r_type = models.CharField(unique=True, max_length=255)
    r_aggregation = models.CharField(max_length=255)

    def __str__(self):  # __str__ on Python 3
        return self.r_id

    class Meta:
        managed = True
        db_table = 'Relationlist'


class Relinsentence(models.Model):
    s_id = models.AutoField(primary_key=True)
    sentence = models.CharField(max_length=255, blank=True, null=True)
    name1 = models.CharField(max_length=255, blank=True, null=True)
    name2 = models.CharField(max_length=255, blank=True, null=True)
    r_type = models.CharField(max_length=255, blank=True, null=True)
    relation = models.CharField(max_length=255, blank=True, null=True)
    score = models.DecimalField(max_digits=6, decimal_places=4, blank=True, null=True)
    url = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):  # __str__ on Python 3
        return self.s_id

    class Meta:
        managed = True
        db_table = 'Relinsentence'

