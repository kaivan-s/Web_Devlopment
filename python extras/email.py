#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Fri Dec  8 00:30:06 2017

@author: kaivanshah
"""

import smtplib

content="Example Email"

try:
    email=smtplib.SMTP('smtp.gmail.com',465)
    email.ehlo()
    email.starttls()
    email.ehlo()
    email.login('kaivanshah1663@gmail.com','QWERTY654321')
    email.sendmail('kaivanshah1663@gmail.com','16ce114@charusat.edu.in',content)
    email.close()
    print('Email sent')

except Exception as exp:
    print(exp)
    
    