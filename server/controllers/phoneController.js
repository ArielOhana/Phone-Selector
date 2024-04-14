const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const Phone = require('../models/phonemodel');
const fuzzy = require('fuzzy-search');
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
                let image = await element.$eval('div > div', div => div.style.backgroundImage);
                image = image.match(/http.*?\.jpg/g)[0];
                const url = await element.$eval('div > div.List__content___ohPG0 > a', a => {return a.href.replace("https://versus.com/en/","")});
                const name = await element.$eval('div > div.List__content___ohPG0 > a', a => {return a.text.trim()})
                Output.push({name, url, image})
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
            const category = await liElement.$eval('span', span => span.textContent.trim());
            const value = await liElement.$eval('em', em => em.textContent.trim());
            properties.push({ category, value });
        }
        const overallRating = await page.$eval('div.Rating__score___1UowR b', b => b.textContent.trim());
        rating.push({category: "overallRating", value: overallRating})
         const divElements = await page.$$('div.Features__feature___1foJP')
         for (const element of divElements) {
            const category = await element.$eval('p', p => p.textContent.trim());
            const value = await element.$eval('div > div > b', b => b.textContent.trim());
            rating.push({ category, value });

         }
        res.status(200).json({properties, rating});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        await browser.close();
    }
}
exports.AddPhone = async (req,res) =>{
    try{
        const phonedetails = req.body
        const name = phonedetails?.name
        const currentphone = await Phone.findOne({ name })
        if (currentphone)
        {
            res.status(200).json({content: "phone already exists in the database",type:'info' , phone: currentphone})
        }
        else
        {
        const properties = phonedetails.properties.map(property => ({
            category: property.category,
            value: property.value
        }));

        const rating = phonedetails.rating.map(rating => ({
            category: rating.category,
            value: rating.value
        }));
        const newphone = await Phone.create({
            name : phonedetails?.name,
            url: phonedetails?.url,
            image : phonedetails?.image,
            properties,
            rating,
        })
        res.status(200).json({content:"new phone added successfully to the database",type:"success", phone: newphone})

    }
    }
catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
} 
}
exports.updatePhone = async (req, res) => {
    const receivedPhone = req.body;
    
    try {
        const currentPhone = await Phone.findOne({ name: receivedPhone.name });

        if (!currentPhone) {
            return res.status(404).json({ message: 'Phone not found in the database' });
        }

        const properties = receivedPhone.properties
            ? receivedPhone.properties.map(property => ({
                category: property.category,
                value: property.value
            }))
            : currentPhone.properties;

        const rating = receivedPhone.rating
            ? receivedPhone.rating.map(rating => ({
                category: rating.category,
                value: rating.value
            }))
            : currentPhone.rating;

        const image = receivedPhone.image || currentPhone.image;

        const updatedPhone = await Phone.findOneAndUpdate(
            { name: receivedPhone.name },
            { $set: { properties, rating, image } },
            { new: true }
        );

        res.status(200).json({ message: 'Phone updated successfully', phone: updatedPhone });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
}
exports.getAllPhones = async (req, res) => {
    try {
        const searchTerm = req.params.searchTerm || "";      
        const phones = await Phone.find({ name: { $regex: `.*${searchTerm}.*`, $options: 'i' } });        
        const searcher = new fuzzy(phones, ['name']);
        const verifiedPhones = searcher.search(searchTerm);        
        res.status(200).json(verifiedPhones);
    } catch (error) {
        console.error('Error finding similar phone names:', error);
        throw error;
    }
}