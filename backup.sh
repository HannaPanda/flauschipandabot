#!/bin/bash

# Backup Verzeichnis
REPO=/backup/borg
ARCHIVE_NAME=$(date +'%Y-%m-%d_%H-%M-%S')

# Quelle
SOURCE=/var/www/flauschipandabot

# Log-Datei
LOGFILE=/var/log/borg_backup.log

# Umgebungsvariable setzen, um unbekannte Repositories zu akzeptieren
export BORG_UNKNOWN_UNENCRYPTED_REPO_ACCESS_IS_OK=yes

# Borg Backup erstellen
borg create \
    --verbose \
    --filter AME \
    --list \
    --stats \
    --show-rc \
    --compression zstd,3 \
    --exclude-from /var/www/flauschipandabot/borg-excludes.txt \
    $REPO::${ARCHIVE_NAME} \
    $SOURCE >> $LOGFILE 2>&1

# Alte Backups aufbewahren: Behalte 7 tägliche, 4 wöchentliche, 6 monatliche
borg prune \
    --list \
    --glob-archives '{now:%Y-%m-%d}*' \
    --keep-daily=7 \
    --keep-weekly=4 \
    --keep-monthly=6 \
    $REPO >> $LOGFILE 2>&1

# Optional: Exit-Code überprüfen und loggen
backup_exit=$?
if [ ${backup_exit} -eq 0 ]; then
    echo "Backup successful: $(date)" >> $LOGFILE
else
    echo "Backup failed: $(date)" >> $LOGFILE
fi

chown -R flauschipandabot:flauschipandabot $REPO

exit ${backup_exit}
