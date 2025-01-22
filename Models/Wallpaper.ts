import { prop, getModelForClass, modelOptions, DocumentType } from '@typegoose/typegoose';
import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";
import axios from "axios";

@modelOptions({ schemaOptions: { collection: 'wallpapers' } })
export class Wallpaper {
    @prop({ required: true, type: String })
    public name!: string;

    @prop({ required: true, type: String })
    public category!: string;

    @prop({ required: true, type: String })
    public attribution!: string;

    @prop({ required: true, type: String })
    public path!: string;

    public static async downloadAndSaveWallpaper(url: string, category: string, attribution: string): Promise<DocumentType<Wallpaper>> {
        try {
            // Fetch the image from URL
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            const imageBuffer = Buffer.from(response.data, 'binary');

            // Define image path
            const categoryPath = path.join(__dirname, '../public/images/wallpaper', category);
            if (!fs.existsSync(categoryPath)) {
                fs.mkdirSync(categoryPath, { recursive: true });
            }
            const imageName = path.basename(url, path.extname(url)) + '.webp';
            const imagePath = path.join(categoryPath, imageName);

            // Resize and save the image in webp format
            await sharp(imageBuffer)
                .resize({ width: 2560 }) // Max 2K resolution
                .webp({ quality: 50 }) // Highest compression
                .toFile(imagePath, (err, info) => {
                    console.log(err);
                });

            // Create Wallpaper document with relative path
            const relativeImagePath = path.join('/static/images/wallpaper', category, imageName);
            const wallpaper = new WallpaperModel({
                name: imageName,
                category,
                attribution,
                path: relativeImagePath
            });
            return await wallpaper.save();
        } catch (error) {
            console.error('Error saving wallpaper:', error);
            throw error;
        }
    }

    public static async findRandomByCategory(category: string): Promise<Wallpaper | null> {
        try {
            const randomWallpaper = await WallpaperModel.aggregate([
                { $match: { category: category } },
                { $sample: { size: 1 } }
            ]);

            if (randomWallpaper.length > 0) {
                return randomWallpaper[0] as Wallpaper;
            }

            return null;
        } catch (error) {
            console.error('Error fetching random wallpaper by category:', error);
            throw error;
        }
    }
}

const WallpaperModel = getModelForClass(Wallpaper);
export default WallpaperModel;
