const express = require('express');
const bodyParser = require('body-parser');


const app = express();
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());


let halls = [
    { id: 1, name: "Room1", no_of_seats: 100,amenities:"A/C", price_for_1hour:1000,isAvailable: true },
    { id: 2, name: "Room2",  no_of_seats: 200,amenities:"A/C",price_for_1hour:900, isAvailable: true },
    { id: 3, name: "Room3",  no_of_seats: 50, amenities:"NON A/C",price_for_1hour:500,isAvailable: true }
];

let bookings = [
    { booking_id: 101, customer_name: "Pavithra", date: "10/10/2024",start_time:"8.00am", end_time:"2.00pm",room_id: 1 },
    { booking_id:102, customer_name: "Satheesh",  date: "13/11/2024",start_time:"7.00am",end_time:"4.00pm", room_id: 2 },
    { booking_id: 103, customer_name: "Pavithra",  date: "5/12/2024", start_time:"6.00am",end_time:"5.00pm",room_id: 3 }
];

let booked_rooms= [
    {room_name: "Room1", booked_status: "Booked",customer_name: "Pavithra", date: "10/10/2024",start_time:"8.00am", end_time:"2.00pm" },
    {room_name: "Room2", booked_status: "Booked",  customer_name: "Satheesh", date: "13/11/2024",start_time:"7.00am",end_time:"4.00pm"},
    {room_name: "Room3", booked_status: "Booked", customer_name: "Pavithra", date: "5/12/2024", start_time:"6.00am",end_time:"5.00pm" }
];

let cust_booked_rooms= [
    {customer_name: "Pavithra",room_name: "Room1", date: "10/10/2024",start_time:"8.00am", end_time:"2.00pm" },
    {customer_name: "Satheesh",room_name: "Room2",   date: "13/11/2024",start_time:"7.00am",end_time:"4.00pm"},
    { customer_name: "Pavithra",room_name: "Room3",  date: "5/12/2024", start_time:"6.00am",end_time:"5.00pm" }
];

let cust_report= [
    {customer_name: "Pavithra",room_name: "Room1", date: "10/10/2024",start_time:"8.00am", end_time:"2.00pm",booking_id: 101,booking_date: "10/10/2024", booked_status: "Booked" },
    {customer_name: "Satheesh",room_name: "Room2",   date: "13/11/2024",start_time:"7.00am",end_time:"4.00pm",booking_id: 102,booking_date: "13/11/2024", booked_status: "Booked"},
    { customer_name: "Pavithra",room_name: "Room3",  date: "5/12/2024", start_time:"6.00am",end_time:"5.00pm",booking_id: 103 ,booking_date: "5/12/2024", booked_status: "Booked"}
];

//Question1
app.get('/halls', (req, res) => {
    res.json(halls);
});

//Question2
app.get('/bookings', (req, res) => {
    res.json(bookings);
});

//Question3
app.get('/listbookings', (req, res) => {
    res.json(booked_rooms);
});

//Question4
app.get('/customerbookings', (req, res) => {
    res.json(cust_booked_rooms);
});

//Question5
app.get('/custreport', (req, res) => {
    res.json(cust_report);
});


app.get('/halls/:hallId/availability', (req, res) => {
    const hallId = parseInt(req.params.hallId);
    const hall = halls.find(h => h.id === hallId);

    if (!hall) {
        return res.status(404).json({ message: 'Hall not found' });
    }

    const availableBookings = bookings.filter(b => b.hallId === hallId && b.status === 'booked');
    const isAvailable = availableBookings.length === 0;

    res.json({ hallId, isAvailable });
});


app.post('/bookings', (req, res) => {
    const { hallId, userName, date, timeSlot } = req.body;

    if (!hallId || !userName || !date || !timeSlot) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const hall = halls.find(h => h.id === hallId);

    if (!hall) {
        return res.status(404).json({ message: 'Hall not found' });
    }

    
    const isBooked = bookings.some(b => b.hallId === hallId && b.date === date && b.timeSlot === timeSlot && b.status === 'booked');

    if (isBooked) {
        return res.status(400).json({ message: 'Hall is already booked for this time slot' });
    }

   
    const newBooking = {
        id: bookings.length + 1,
        hallId,
        userName,
        date,
        timeSlot,
        status: 'booked'
    };

    bookings.push(newBooking);
    res.status(201).json(newBooking);
});


app.delete('/bookings/:bookingId', (req, res) => {
    const bookingId = parseInt(req.params.bookingId);
    const bookingIndex = bookings.findIndex(b => b.id === bookingId);

    if (bookingIndex === -1) {
        return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[bookingIndex];

  
    bookings.splice(bookingIndex, 1);
    res.json({ message: `Booking with ID ${bookingId} has been canceled`, booking });
});





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
