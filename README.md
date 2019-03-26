# What is MathStick?
MathStick is an online multiplaer game created to challenge your logical thinking and creativity. 
The goal is simple - move 1 matchstick so that the equation becomes correct. You can compete against your friends to see who can
solve the puzzle faster.

Here's a link to the game: [mathstick.net](https://mathstick.net/)

# How do I run it locally?

1. Install python3 and mysql-server

```bash
sudo apt-get install python3 python3-pip mysql-server
```

2. Install python dependencies

```bash
pip3 install -r requirements.txt
```

3. Copy the ```config.py.TEMPLATE``` file and fill in your webserver and database configuration

```bash
cp config.py.TEMPLATE config.py
vim config.py
```

```python
# Server Configuration File

# Webserver Configuration
HOST = '[your_host]'
PORT = '[your_port]'

# Database Configuration
DATABASE_HOST = '[your_db_host]'
DATABASE_USER = '[your_db_user]'
DATABASE_PASSWORD = '[your_db_password]'
DATABASE_DATABASE = '[your_db_name]'

# Default values
DEFAULT_STICK_URL = '/static/images/stick4.png'
```

4. Open your MySQL client and create the database

```bash
mysql -u [your_db_user] -p
```

```sql
CREATE DATABASE `[your_db_name]` CHARACTER SET = 'utf8';
```

5. Dump the example data into the database

```bash
mysql -u [your_db_user] -p [your_db_name] < database_dump.sql
```

6. Fire it up

```bash
python3 main.py
```
