const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

// const chunks = [];//py
const saltRounds = 11;

exports.createUser = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
        } = req.body;
        const usernameExist = await Users.findOne({ username });
        const emailExist = await Users.findOne({ email });
        if (usernameExist) {
            return res
                .status(200)
                .json({ status: false, message: "Username already taken" });
        } else if (emailExist) {
            return res
                .status(200)
                .json({ status: false, message:"Email address already taken" });
        } else {
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            const newUser = await Users.create({
                username,
                email,
                password: hashedPassword,
            });
            const emailToken = jwt.sign(
                { _id: newUser._id.toString() },
                process.env.SECRET_JWT_KEY,
                {
                    expiresIn: "24h",
                }
            );
            sendEmailVerification(newUser.email, emailToken);
            res.status(201).json({
                status: true,
                message:"User created successfully, please verify your email address and sign in",
                // user: {username: newUser.username, email: newUser.email}
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

exports.updateThisUser = async (req, res) => {
    try {
        const {
            username,
            displayName,
            email,
            profileImg,
            birthDate,
            about,
        } = req.body;
        const newUser = await Users.updateOne({
            username,
            displayName,
            email,
            profileImg,
            birthDate,
            about,
        });
        res.send(newUser);
    } catch (error) {
      console.error("Error editing User:", error);
      res.status(500).send("Internal Server Error");
    }
  };

async function sendEmailVerification(toEmail, emailToken) {
    try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MYEMAIL,
            pass: process.env.MYEMAIL_PASSWORD,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
    
        const mailOptions = {
          from:  process.env.MYEMAIL,
          to: toEmail,
          subject: 'Email Verification',
          text: `Hey, \nPlease click the following link to verify your email:\n ${process.env.SERVER_ADDRESS}/users/verify/${emailToken}`,
        };
    
        const info = await transporter.sendMail(mailOptions);
        console.log('Email verification sent:', info);
      } catch (error) {
        console.error('Email verification error:', error);
      }
    }

exports.Signin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({ username });

        if (!user) {
            return res.status(200).json({
                status: false,
                message: "Username or password incorrect",
            });
        } else if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { _id: user._id },
                process.env.SECRET_JWT_KEY,
                {
                    expiresIn: "24h",
                }
            );
            if (user.verified) {
                res.cookie("token", token, {
                    httpOnly: true,
                    maxAge: 864000,
                    sameSite: "strict",
                });
                res.status(200).send({
                    status: true,
                    message: "Logged in successfully",
                    user: {username: user.username, email: user.email},
                });
            } else {
                return res.status(200).json({
                    status: false,
                    message: "Please verify your email address",
                });
            }
        } else {
            return res.status(200).json({
                status: false,
                message: "Username or password incorrect",
            });
        }
    } catch (error) {
        console.log("Sign in error: " + error.message)
        res.status(500).json({
            status: false,
            message: "An error occurred during login",
            error: error,
        });
    }
};

exports.signout = async (req, res) => {
    try {
        res.cookie("token", "none", {
            httpOnly: true,
            maxAge: 1,
            sameSite: "strict",
        });
        res.status(200).send({
            status: true,
            message: "Signout successfully",
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            message: "An error occurred during signout",
            error: error,
        });
    }
};

exports.verifyToken = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res
            .status(401)
            .json({success:false,type:'error', message: "Unauthorized: No token provided" });
    }
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_JWT_KEY);
        const user = await Users.findById(decodedToken._id);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({success:false,type:'error', message: "Unauthorized: Invalid token" });
    }
};

exports.verifyEmail = async (req, res) => {
    try {
        const verificationToken = req.params.token;
        const decoded = jwt.verify(
            verificationToken,
            process.env.SECRET_JWT_KEY
        );

        const userId = decoded._id;

        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            { verified: true },
            { new: true } //sets updatedUser new one and not the original
        );

        if (updatedUser) {
            return res.send(`
        <html>
          <head>
            <title>Email Verification</title>
          </head>
          <body>
            <h1>Email Verification Successful</h1>
            <p>Your email has been successfully verified. You can now log in.</p>
          </body>
        </html>
      `);
        } else {
            return res.status(404).send(`
        <html>
          <head>
            <title>Email Verification Error</title>
          </head>
          <body>
            <h1>Error</h1>
            <p>User not found or not updated.</p>
          </body>
        </html>
      `);
        }
    } catch (error) {
        console.error("Error verifying user:", error);
        res.status(500).send(`
      <html>
        <head>
          <title>Internal Server Error</title>
        </head>
        <body>
          <h1>Error</h1>
          <p>Internal Server Error</p>
        </body>
      </html>
    `);
    }
};
exports.getPhones = async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const Output = [];

    const SelectedPhone = req.params.phone;

    if (SelectedPhone) {
        try {
            await page.goto(process.env.INFOWEB);
            await page.type(process.env.WEBSCROLLERONE, SelectedPhone);
            await page.keyboard.press('Enter');
            await page.waitForNavigation();
            const html = await page.content();
            const $ = cheerio.load(html);
            
            const maindivs = await page.$$('div.List__item___1r5pi');
            for (element of maindivs)
            {
                const image = await element.$eval('div > div', div => div.style.backgroundImage);
                const link = await element.$eval('div > div.List__content___ohPG0 > a', a => {return a.href.replace("https://versus.com/en/","")})
                const phone = await element.$eval('div > div.List__content___ohPG0 > a', a => {return a.text.trim()})
                Output.push({phone, link, image})
            }
        } catch (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
            return;
        } finally {
            await browser.close();
        }
    } else {
        res.status(400).send('No phone name provided.');
        return;
    }

    res.status(200).json(Output);
};
exports.getPhonesDetailsByURL = async (req, res) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        let properties = [];
        let rating = [];
        const url = process.env.INFOWEB+req.params.url;
        await page.goto(url);
        const html = await page.content();
        const $ = cheerio.load(html);
        const liElements = await page.$$(process.env.WEBSCROLLERTWO);
        for (const liElement of liElements) {
            const Catagory = await liElement.$eval('span', span => span.textContent.trim());
            const Value = await liElement.$eval('em', em => em.textContent.trim());
            properties.push({ Catagory, Value });
        }
        const overallRating = await page.$eval('div.Rating__score___1UowR b', b => b.textContent.trim());
        rating.push({Catagory: "overallRating", Value: overallRating})
         const divElements = await page.$$('div.Features__feature___1foJP')
         for (const element of divElements) {
            const Catagory = await element.$eval('p', p => p.textContent.trim());
            const Value = await element.$eval('div > div > b', b => b.textContent.trim());
            rating.push({ Catagory, Value });

         }
        res.status(200).json({properties, rating});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        await browser.close();
    }
}
