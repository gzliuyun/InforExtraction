from __future__ import unicode_literals

from django.db import models

# Create your models here.
class people_list(models.Model):
	p_id = models.IntegerField(max_length=11)
	name = models.CharField(max_length=255)
	introduction = models.TextField()
	url = models.URLField()
	photo_url = models.URLField()

class relation_list(models.Field):
	r_id = models.IntegerField(max_length=11)
	r_type = models.CharField(max_length=255)

class people_relation(models.Model):
	n_id = model.IntegerField(max_length=11)
	p1_id = models.IntegerField(max_length=11)
	p2_id = models.IntegerField(max_length=11)
	r_id = models.IntegerField(max_length=11)

class rel_in_sentence(models.Model):
	s_id = models.IntegerField(max_length=11)
	sentence = models.CharField(max_length=255)
	name1 = models.CharField(max_length=255)
	name2 = models.CharField(max_length=255)
	r_type = models.CharField(max_length=255)
	relation = models.CharField(max_length=255)
	score = models.DecimalField(max_digits=6)
	url = models.URLField()
