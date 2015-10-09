import os
import smtplib
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart

from os import path

class PythonGmailer:
    def __init__(self, username, password):
        """Allows for one to easily send messages via gmail using 
        the py :)

        Arguments:
            username -- The username of the email account
            password -- The password of the email account
        """
        self.username = username
        self.password = password
        self.msg = None

    def new(self, header):
        """Create a new email with header information

            Arguments: 
                header -- A dictionary item containing the following fields:

                    'Subject' -- The subject of the email message
                    'From'    -- The email address of the sender
                    'To'      -- The email address of the recipient
        """
        self.msg = MIMEMultipart()
        self.msg['Subject'] = header['Subject']
        self.msg['From'] = header['From']
        self.msg['To'] = header['To']

    def body(self, text=None):
        """Attach a text file to an email. Only use AFTER NewEmail
        
            Arguments:
                text -- a string of text for use in the email body
        """
        if text:
            text = MIMEText(text)
            self.msg.attach(text)

    def image(self, img_path, callback=None):
        """Attach an image to an email. Only use AFTER NewEmail
        
            Arguments:
                img_path -- the absolute path of an image file in the 
                format of jpg, gif, png

                callback -- if an image fails to load, returns
                            the images name via callback
        """
        def _cb(*args):
            if callback:
                callback(*args)


        img_data = open(img_path, 'rb').read()

        try:
            img = MIMEImage(img_data, name=os.path.basename(img_path))
            self.msg.attach(img)
        except:
            #image not readable
            _cb("failed", img_path)

    def send(self):
        """Send the email through Gmail"""
        sender = self.msg['From']
        receiver = self.msg['To']

        server = smtplib.SMTP('smtp.gmail.com:587')
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(self.username, self.password)
        server.sendmail(sender, receiver, self.msg.as_string())
        server.quit()

        # destroy message
        self.destroy()

    def destroy(self):
        self.msg = None

def main():
    """Example Useage"""
    
    username = ‘username@gmail.com’
    password = ‘password’
    emailer = PythonGmailer(username, password)

    msg = dict()
    msg['Subject'] = 'subject'
    msg['From'] = 'sender@gmail.com'
    msg['To'] = 'recipient@gmail.com'

    emailer.new(msg)
    emailer.body("example_text")
    emailer.image('#1.jpg')
    emailer.send()

if __name__ == '__main__':
    main()
