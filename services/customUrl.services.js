const urlSchema = require('../models/url.js')
exports.genHalfCustom = async (originalUrl) => {
        try {
                const url = await urlSchema.findOne({ urlCode: originalUrl });
                if (url)
                        return 3;
                return originalUrl;
        }
        catch (err) {
                console.log(err);
               throw err;
        }
}