<x-mail::message>
# Password Reset Request

Hello,

We received a request to reset your password for your HireIn account. Click the button below to set a new password. This link will expire in 60 minutes.

<x-mail::button :url="$url">
Reset Password
</x-mail::button>

If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:
[{{ $url }}]({{ $url }})

If you did not request a password reset, no further action is required.

Thanks,<br>
The HireIn Team
</x-mail::message>
