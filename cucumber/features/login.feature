
Feature: Logging In
	The user should be able to register a new account and log in to
    access the secure page.

	Scenario: registering, validating and logging in
		Given The browser is open on the home page
		When I click on the "register" link
        When I enter "jdoe" in the "username" field
        When I enter "p455w0rd" in the "password" field
		When I enter "jdoe@coventry.ac.uk" in the "email" field
		When I click on the submit button
        Then the heading should be "Validate Your Account"
        When I enter the email link in the browser
		Then the heading should be "Account Validated"
        When I click on the "log in" link
        Then the heading should be "Log In"
        When I enter "jdoe" in the "username" field
        When I enter "p455w0rd" in the "password" field
		When I click on the submit button
        Then the heading should be "Secure Page"

	Scenario: registering and logging in without validating
		Given The browser is open on the home page
		When I click on the "register" link
        When I enter "jdoe" in the "username" field
        When I enter "p455w0rd" in the "password" field
		When I enter "jdoe@coventry.ac.uk" in the "email" field
		When I click on the submit button
        Then the heading should be "Validate Your Account"
        When I access the homepage
        Then the heading should be "Log In"
        When I enter "jdoe" in the "username" field
        When I enter "p455w0rd" in the "password" field
		When I click on the submit button
        Then the heading should be "Validate Your Account"
