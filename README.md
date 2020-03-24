
# Assignment Template

This repository contains the base files for the assignment. You will need to create a _private duplicate_ in your module organisation. Carry out the following steps:

1. Click on the **Use this template** button at the top of the screen.
2. Change the owner to your module using the dropdown list.
3. Change the repository name:
    1. If this is your first attempt use your University Username (the one you use to log into the university systems).
    2. If you are doing the module resit append `-resit` to the end.
4. In the **Description** field enter the name of your project topic (eg. `Auction`).
5. Clone your private repository (refer to the **setup** lab if you have forgotten how to do this).

## Local Config Settings

Before you make any commits you need to update the [local config settings](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup). Start by using the Terminal (or Git Bash on Windows) navigate inside the project. Once you are in this directory run the following commands, substituting you name as it appears on your ID badge and your university email address (without the `uni.` domain prefix).

```bash
git config user.name 'John Doe'
git config user.email 'doej@coventry.ac.uk'
git config core.hooksPath .githooks
git config --add merge.ff false
```

## Configuring the Email

The assignment template includes code to send an email validation link to the users when they register. This link needs to be clicked to enable the account and allow them to log in. For this to work you will need to configure the code to connect to an IMAP-enabled email account which it will use to send the emails.

The simplest solution is to use a Gmail account and to do this you will need to carry out three steps:

1. Go to the gmail settings screen and, in the "Forwarding and POP/IMAP" tab enable IMAP support.
2. Use the following link to enable less secure apps https://www.google.com/settings/security/lesssecureapps
3. Rename the `config.sample.json` file to `config.json` and update this with your account details.

Now you can start working on the assignment. Remember to install all the dependencies listed in the `package.json` file.

## Feature Branching

You should not be committing directly to the **master** branch, instead each task or activity you complete should be in its own _feature branch_. **Don't attempt this until after the lecture that covers version control (git)**. You should following the following steps:

1. Log onto GitHub and add an issue to the _issue tracker_, this is your _todo_ list.
2. Create a local feature branch making sure that the name of the branch includes both the issue _number_ and _title_ (in lower case).
    1. For example: `git checkout -b iss023/fix-login-bug`.
    2. You can see a list of all the local branches using `git branch`.
3. As you work on the issue make your local commits by:
    1. staging the files with `git add --all`.
    2. committing with the `no-ff` flag, eg. `git commit --no-ff -m 'detailed commit message here'`.
4. When the task is complete and all the tests pass, push the feature branch to GitHub.
    1. For example `git push origin iss023/fix-login-bug` would push the branch named above.
    2. Switch back to the _master_ branch with `git checkout master`.
5. Back on GitHub raise a **Pull Request** that merges this feature branch to the _master_ branch.
5. If there are no issues you can then merge the branch using the button in the _Pull Request_ interface.
6. Pull the latest version of the master branch code using `git pull origin master`.

