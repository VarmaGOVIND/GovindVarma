from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from .models import VisitorCount, ContactSubmission
import json
import resend


def home(request):
    """Main view for the portfolio homepage"""
    # Get or increment visitor count
    visitor_count = VisitorCount.get_count()
    
    # Format the visitor count with commas
    formatted_count = f"{visitor_count:,}"
    
    # Handle contact form submission
    if request.method == 'POST':
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        # Save the contact submission
        ContactSubmission.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        
        # Send email using Resend
        try:
            resend.api_key = settings.RESEND_API_KEY
            
            # Subject mapping
            subject_map = {
                'job': 'Job Opportunity',
                'project': 'Project Collaboration',
                'mentorship': 'Mentorship',
                'other': 'Just Saying Hi!'
            }
            
            email_subject = subject_map.get(subject, 'New Contact Form Submission')
            
            params = {
                "from": "Portfolio <onboarding@resend.dev>",  # Resend ka default sender
                "to": ["govindvarmasets@gmail.com"],  # Tumhara email
                "subject": f"{email_subject} - {name}",
                "html": f"""
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Subject:</strong> {email_subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>{message}</p>
                    <hr>
                    <p><small>Sent from Portfolio Contact Form</small></p>
                """
            }
            
            resend.Emails.send(params)
            email_sent = True
        except Exception as e:
            print(f"Email send error: {e}")
            email_sent = False
        
        # Return JSON response for AJAX
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse({
                'success': True,
                'message': 'Thank you for your message! I will get back to you soon.'
            })
        
        # For regular POST, redirect with success message
        return render(request, 'core/index.html', {
            'visitor_count': formatted_count,
            'success_message': 'Thank you for your message! I will get back to you soon.'
        })
    
    # GET request
    return render(request, 'core/index.html', {
        'visitor_count': formatted_count
    })


@require_http_methods(["POST"])
def contact_ajax(request):
    """Handle AJAX contact form submissions"""
    try:
        data = json.loads(request.body)
        
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')
        
        # Save to database
        contact = ContactSubmission.objects.create(
            name=name,
            email=email,
            subject=subject,
            message=message
        )
        
        # Send email using Resend
        try:
            resend.api_key = settings.RESEND_API_KEY
            
            subject_map = {
                'job': 'Job Opportunity',
                'project': 'Project Collaboration',
                'mentorship': 'Mentorship',
                'other': 'Just Saying Hi!'
            }
            
            email_subject = subject_map.get(subject, 'New Contact Form Submission')
            
            params = {
                "from": "Portfolio <onboarding@resend.dev>",
                "to": ["govindvarmasets@gmail.com"],
                "subject": f"{email_subject} - {name}",
                "html": f"""
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> {name}</p>
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Subject:</strong> {email_subject}</p>
                    <p><strong>Message:</strong></p>
                    <p>{message}</p>
                    <hr>
                    <p><small>Sent from Portfolio Contact Form</small></p>
                """
            }
            
            resend.Emails.send(params)
        except Exception as e:
            print(f"Email send error: {e}")
        
        return JsonResponse({
            'success': True,
            'message': 'Thank you for your message! I will get back to you soon.'
        })
    except Exception as e:
        print(f"Contact form error: {e}")
        return JsonResponse({
            'success': False,
            'message': 'Something went wrong. Please try again.'
        }, status=400)