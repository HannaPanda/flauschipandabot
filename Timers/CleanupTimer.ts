    import AbstractTimer from "../Abstracts/AbstractTimer";
    import fs from "fs";
    import path from "path";

/**
 * CleanupTimer class that extends AbstractTimer.
 * This timer is responsible for cleaning up old audio files in the temporary directory.
 * It runs at a regular interval and deletes files older than a specified age.
 */
class CleanupTimer extends AbstractTimer
{
    /**
     * Indicates whether the timer is active.
     * @type {boolean}
     */
    isActive = true;

    /**
     * The interval in minutes at which the cleanup handler will be executed.
     * @type {number}
     */
    minutes = 60; // Runs the cleanup every 60 minutes

    /**
     * Number of chat lines required to trigger the timer.
     * Set to 0 to ensure the timer runs regardless of chat activity.
     * @type {number}
     */
    chatLines = 0;

    /**
     * Handler function that performs the cleanup of old files in the temporary directory.
     */
    handler = () => {
        const tempDir = path.join(__dirname, "../public/audio/tmp");
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 1 day in milliseconds

        fs.readdir(tempDir, (err, files) => {
            if (err) {
                console.error("Error reading the directory", err);
                return;
            }

            files.forEach(file => {
                const filePath = path.join(tempDir, file);
                fs.stat(filePath, (err, stats) => {
                    if (err) {
                        console.error(`Error retrieving file information: ${filePath}`, err);
                        return;
                    }

                    // Delete the file if it is older than 1 day
                    if (now - stats.mtimeMs > maxAge) {
                        fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(`Error deleting the file: ${filePath}`, err);
                            } else {
                                console.log(`Old file deleted: ${filePath}`);
                            }
                        });
                    }
                });
            });
        });
    }
}

let cleanupTimer = new CleanupTimer();

export default cleanupTimer;
