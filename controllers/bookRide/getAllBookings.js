const Ride = require('../../models/RideOffer');
const geolib = require('geolib'); // Ensure geolib is imported

const getAllRides = async (req, res) => {
    try {
        const { pickupDate, sourcePoint, destinationPoint, seatsBooked, femaleOnly } = req.body;
        let rides = await Ride.find({}).populate('driver');

        const isWithinRadius = (point1, point2, radius = 20000) => {
            const distance = geolib.getDistance(point1, point2);
            return distance <= radius;
        };

        const calculateDuration = (startPoint, endPoint, avgSpeed = 50) => {
            const distanceMeters = geolib.getDistance(startPoint, endPoint);
            const distanceKm = distanceMeters / 1000;
            const durationHours = distanceKm / avgSpeed;
            const durationMinutes = Math.round(durationHours * 60);
            return durationMinutes;
        };

        const addMinutesToTime = (time, minutesToAdd) => {
            const [hours, minutes] = time.split(':').map(t => parseInt(t, 10));
            const totalMinutes = hours * 60 + minutes + minutesToAdd;
            const newHours = (Math.floor(totalMinutes / 60) + 12) % 24; // 12-hour format conversion
            const newMinutes = totalMinutes % 60;
            const period = newHours >= 12 ? 'PM' : 'AM';
            return `${newHours % 12 || 12}:${newMinutes.toString().padStart(2, '0')} ${period}`;
        };

        if (pickupDate) {
            const pickupDateFormatted = new Date(pickupDate).toISOString().split('T')[0];
            rides = rides.filter(ride => {
                const rideDate = new Date(ride.date);
                const rideDateFormatted = isNaN(rideDate.getTime()) ? null : rideDate.toISOString().split('T')[0];
                return rideDateFormatted === pickupDateFormatted;
            });
        }

        if (sourcePoint) {
            rides = rides.filter(ride => {
                const rideSourcePoint = {
                    latitude: parseFloat(ride.sourcePoint.latitude),
                    longitude: parseFloat(ride.sourcePoint.longitude)
                };
                const inputSourcePoint = {
                    latitude: parseFloat(sourcePoint.latitude),
                    longitude: parseFloat(sourcePoint.longitude)
                };

                const rideStopPoint = ride.addStopPoint ? {
                    latitude: parseFloat(ride.addStopPoint.latitude),
                    longitude: parseFloat(ride.addStopPoint.longitude)
                } : null;

                let start = null;
                if (isWithinRadius(rideSourcePoint, inputSourcePoint)) {
                    start = {
                        name: ride.sourceName,
                        coordinates: rideSourcePoint
                    };
                } else if (rideStopPoint && isWithinRadius(rideStopPoint, inputSourcePoint)) {
                    start = {
                        name: ride.addStopName,
                        coordinates: rideStopPoint
                    };
                }

                if (start) {
                    ride.start = start;
                    return true;
                }
                return false;
            });
        }

        if (destinationPoint) {
            rides = rides.filter(ride => {
                const rideDestinationPoint = {
                    latitude: parseFloat(ride.destinationPoint.latitude),
                    longitude: parseFloat(ride.destinationPoint.longitude)
                };
                const inputDestinationPoint = {
                    latitude: parseFloat(destinationPoint.latitude),
                    longitude: parseFloat(destinationPoint.longitude)
                };

                const rideStopPoint = ride.addStopPoint ? {
                    latitude: parseFloat(ride.addStopPoint.latitude),
                    longitude: parseFloat(ride.addStopPoint.longitude)
                } : null;

                let end = null;
                if (isWithinRadius(rideDestinationPoint, inputDestinationPoint)) {
                    end = {
                        name: ride.destinationName,
                        coordinates: rideDestinationPoint
                    };
                } else if (rideStopPoint && isWithinRadius(rideStopPoint, inputDestinationPoint)) {
                    end = {
                        name: ride.addStopName,
                        coordinates: rideStopPoint
                    };
                }

                if (end) {
                    ride.end = end;
                    return true;
                }
                return false;
            });
        }

        if (seatsBooked) {
            rides = rides.filter(ride => parseInt(ride.seatsOffered, 10) >= parseInt(seatsBooked, 10));
        }

        if (femaleOnly !== undefined) {
            const isFemaleOnly = femaleOnly === true || femaleOnly === 'true';
            rides = rides.filter(ride => ride.gender === isFemaleOnly);
        }

        const response = rides.map(ride => {
            const rideTime = ride.time;
            let startTime = rideTime;
            let endTime = null;
            let finalDuration = null;

            if (ride.start && ride.end) {
                if (ride.start.name === ride.sourceName) {
                    startTime = rideTime; // Original ride time
                } else {
                    const durationToStop = calculateDuration(ride.sourcePoint, ride.addStopPoint);
                    startTime = addMinutesToTime(rideTime, durationToStop);
                }

                if (ride.end.name === ride.destinationName) {
                    const tripDuration = parseInt(ride.tripDuration.split(' ')[0]);
                    endTime = addMinutesToTime(startTime, tripDuration);
                } else {
                    const durationToStop = calculateDuration(ride.destinationPoint, ride.addStopPoint);
                    endTime = addMinutesToTime(startTime, durationToStop);
                }

                finalDuration = calculateDuration(ride.start.coordinates, ride.end.coordinates);
            }

            return {
                ...ride._doc,
                start: ride.start || null,
                end: ride.end || null,
                starttime: startTime,
                endtime: endTime,
                finalDuration: finalDuration ? `${finalDuration} minutes` : null
            };
        });

        res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving rides:', error);
        res.status(500).json({ message: 'Failed to retrieve rides', error: error.message });
    }
};


module.exports = { getAllRides };