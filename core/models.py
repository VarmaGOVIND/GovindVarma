from django.db import models


class VisitorCount(models.Model):
    """Model to track visitor count"""
    count = models.IntegerField(default=0)  # 47 se 0 kar diya
    last_visit = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Visitor Count'
        verbose_name_plural = 'Visitor Counts'

    def __str__(self):
        return f"Visitors: {self.count}"

    @classmethod
    def get_count(cls):
        """Get visitor count without incrementing"""
        visitor, created = cls.objects.get_or_create(pk=1)
        return visitor.count

    @classmethod
    def increment(cls):
        """Increment visitor count and return new count"""
        visitor, created = cls.objects.get_or_create(pk=1)
        visitor.count += 1
        visitor.save()
        return visitor.count

class ContactSubmission(models.Model):
    """Model to store contact form submissions"""
    SUBJECT_CHOICES = [
        ('job', 'Job Opportunity'),
        ('project', 'Project Collaboration'),
        ('mentorship', 'Mentorship'),
        ('other', 'Just Saying Hi!'),
    ]
    
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=20, choices=SUBJECT_CHOICES)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    class Meta:
        verbose_name = 'Contact Submission'
        verbose_name_plural = 'Contact Submissions'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"
