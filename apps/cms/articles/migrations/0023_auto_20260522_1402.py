from django.db import migrations
from articles.models import Article
from users.email import send_consent_emails

def send_email_consent(apps, schema_editor):
    articles = Article.objects.exclude(review_request=None)
    users = [article.review_request.created_by for article in articles]
    send_consent_emails(users)

class Migration(migrations.Migration):

    dependencies = [
        ('articles', '0022_article_deleted_reason'),
    ]

    operations = [
        migrations.RunPython(send_email_consent)
    ]
