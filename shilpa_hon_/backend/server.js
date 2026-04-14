let express = require('express');
let mongodb = require('mongodb');
let cors = require('cors');
let bodyparser = require("body-parser");
let app = express();
let mongoclient = mongodb.MongoClient;
app.use(cors());
let url = process.env.MONGO_URL || "mongodb+srv://shilpa:root@cluster0.vcwlcow.mongodb.net/pizzeria?appName=Cluster0";
let dbName = "pizzeria";

app.use(bodyparser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/pizzas', (req, res) => {
    mongoclient.connect(url, (error, conn) => {
        if (error) {
            console.log("DB Connection Error");
            res.status(500).json({ message: "Database connection failed" });
        } else {
            console.log("DB Connectivity Successful..");
            let db = conn.db(dbName);
            db.collection('pizzas').find().toArray((e, data) => {
                if (e) {
                    res.status(500).json({ message: "Error fetching pizzas" });
                } else {
                    res.json(data);
                }
                conn.close();
            });
        }
    });
});

app.get('/ingredients', (req, res) => {
    mongoclient.connect(url, (error, conn) => {
        if (error) {
            res.status(500).json({ message: "Database connection failed" });
        } else {
            let db = conn.db(dbName);
            db.collection('ingredients').find().toArray((e, data) => {
                if (e) {
                    res.status(500).json({ message: "Error fetching ingredients" });
                } else {
                    res.json(data);
                }
                conn.close();
            });
        }
    });
});

app.post('/signup', (req, res) => {
    mongoclient.connect(url, (error, conn) => {
        if (error) {
            res.status(500).json({ message: "Database connection failed" });
        } else {
            let db = conn.db(dbName);
            let userData = req.body;
            db.collection('users').findOne({ email: userData.email }, (err, user) => {
                if (user) {
                    res.status(400).json({ message: "User already exists" });
                    conn.close();
                } else {
                    db.collection('users').insertOne(userData, (err, result) => {
                        if (err) {
                            res.status(500).json({ message: "Error creating user" });
                        } else {
                            res.status(201).json({ message: "User created successfully" });
                        }
                        conn.close();
                    });
                }
            });
        }
    });
});

app.post('/login', (req, res) => {
    mongoclient.connect(url, (error, conn) => {
        if (error) {
            res.status(500).json({ message: "Database connection failed" });
        } else {
            let db = conn.db(dbName);
            let { email, password } = req.body;
            db.collection('users').findOne({ email: email, password: password }, (err, user) => {
                if (err) {
                    res.status(500).json({ message: "Error authenticating user" });
                } else if (!user) {
                    res.status(401).json({ message: "Invalid credentials" });
                } else {
                    res.status(200).json({ message: "Login successful", user: user });
                }
                conn.close();
            });
        }
    });
});

app.post('/save-order', (req, res) => {
    mongoclient.connect(url, (error, conn) => {
        if (error) {
            res.status(500).json({ message: "Database connection failed" });
        } else {
            let db = conn.db(dbName);
            let orderData = { ...req.body, createdAt: new Date() };
            db.collection('orders').insertOne(orderData, (err, result) => {
                if (err) {
                    res.status(500).json({ message: "Error saving order" });
                } else {
                    res.status(201).json({ message: "Order saved successfully", orderId: result.insertedId });
                }
                conn.close();
            });
        }
    });
});

app.get('/orders/user/:userId', (req, res) => {
    mongoclient.connect(url, (error, conn) => {
        if (error) {
            res.status(500).json({ message: "Database connection failed" });
        } else {
            let db = conn.db(dbName);
            db.collection('orders').find({ userId: req.params.userId }).toArray((err, orders) => {
                if (err) {
                    res.status(500).json({ message: "Error fetching order history" });
                } else {
                    res.json(orders);
                }
                conn.close();
            });
        }
    });
});

app.get('/orders', (req, res) => {
    mongoclient.connect(url, (error, conn) => {
        if (error) {
            res.status(500).json({ message: "Database connection failed" });
        } else {
            let db = conn.db(dbName);
            db.collection('orders').find().toArray((err, orders) => {
                if (err) {
                    res.status(500).json({ message: "Error fetching orders" });
                } else {
                    res.json(orders);
                }
                conn.close();
            });
        }
    });
});

app.put('/orders/:orderId/status', (req, res) => {
    mongoclient.connect(url, (error, conn) => {
        if (error) {
            res.status(500).json({ message: "Database connection failed" });
        } else {
            let db = conn.db(dbName);
            let { ObjectId } = mongodb;
            db.collection('orders').updateOne(
                { _id: new ObjectId(req.params.orderId) },
                { $set: { status: req.body.status } },
                (err, result) => {
                    if (err) {
                        res.status(500).json({ message: "Error updating order status" });
                    } else {
                        res.json({ message: "Order status updated" });
                    }
                    conn.close();
                }
            );
        }
    });
});

app.get('/users/:userId', (req, res) => {
    mongoclient.connect(url, (error, conn) => {
        if (error) {
            res.status(500).json({ message: "Database connection failed" });
        } else {
            let db = conn.db(dbName);
            let { ObjectId } = mongodb;
            db.collection('users').findOne({ _id: new ObjectId(req.params.userId) }, (err, user) => {
                if (err || !user) {
                    res.status(404).json({ message: "User not found" });
                } else {
                    res.json(user);
                }
                conn.close();
            });
        }
    });
});

app.put('/users/:userId', (req, res) => {
    mongoclient.connect(url, (error, conn) => {
        if (error) {
            res.status(500).json({ message: "Database connection failed" });
        } else {
            let db = conn.db(dbName);
            let { ObjectId } = mongodb;
            db.collection('users').updateOne(
                { _id: new ObjectId(req.params.userId) },
                { $set: req.body },
                (err, result) => {
                    if (err) {
                        res.status(500).json({ message: "Error updating user" });
                    } else {
                        res.json({ message: "User updated successfully" });
                    }
                    conn.close();
                }
            );
        }
    });
});

app.get('/admin/stats', (req, res) => {
    mongoclient.connect(url, (error, conn) => {
        if (error) {
            res.status(500).json({ message: "Database connection failed" });
        } else {
            let db = conn.db(dbName);
            Promise.all([
                db.collection('orders').countDocuments(),
                db.collection('users').countDocuments(),
                db.collection('pizzas').countDocuments()
            ]).then(([orders, users, pizzas]) => {
                res.json({ totalOrders: orders, totalUsers: users, totalPizzas: pizzas });
                conn.close();
            }).catch(() => {
                res.status(500).json({ message: "Error fetching stats" });
                conn.close();
            });
        }
    });
});

app.listen(process.env.PORT || 7000, () => {
    console.log("Express Server running..");
});
