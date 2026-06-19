"""
model test
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from core import models

class ModelTest(TestCase):
    """Test the model"""
    def test_user_create_with_email_success(self):
        """test the user with an email success"""
        email = 'test@example.com'
        password = 'test@123'
        user = get_user_model().objects.create_user(
            email=email,
            password=password
        )
        self.assertEqual(user.email, email)
        self.assertTrue(user.check_password(password))

    def test_new_user_email_normalize(self):
        """Test the email is normalized for new user"""
        sample_email = [
          ['Test@example.com', 'Test@example.com'],
          ['TEST2@example.com', 'TEST2@example.com'],
          ['test3@EXAMPLE.com', 'test3@example.com'],
          ['test4@example.COM', 'test4@example.com']
        ]

        for email, expected in sample_email:
            user = get_user_model().objects.create_user(email=email, password='sample@123')
            self.assertEqual(user.email, expected)

    def test_new_user_with_out_email(self):
        """test a new user with out an email adress raise valuerror"""
        with  self.assertRaises(ValueError):
         user = get_user_model().objects.create_user('',password='sample@123')


    def test_create_superuser(self):
        """Test create the super user"""
        email = 'test@example.com'
        password = 'test@123'
        user = get_user_model().objects.create_superuser(email=email, password=password)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_create_restaurant(self):
        """Test for crating restaurants"""
        owner = get_user_model().objects.create_user(
            email='test@example.com',
            password='test@123'
        )
        restaurant = models.Restaurant.objects.create(
           owner=owner,
           name='test restaurant'
        )
        self.assertTrue(str(restaurant), restaurant.name)
    