# Sonos Scheduler

This project was designed to interface with a Sonos smart speaker and control it from within a web page. Instead of building out multiple projects, I kept adding to this one so it doesn't make much sense. When I have time I plan to break out these features into smaller projects that make more sense

You can:
* Play, Pause, Search for Music, and other basic Sonos controls
* Use a scheduler to schedule the Sonos to use text to speech controls (ex: at 6:00 am, tell me the weather for today or at 8:00pm give me a quote of the day)
* Create Workout routines and set them as completed.  The workouts are on a weekly screen which you can click back and forth to see what you accomplished in prior weeks

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them

1. NodeJS installation
2. Either a local MongoDB instance or a remote Mongo provider like [Mlab](https://mlab.com/)
3. Need to have a node server running [node-sonos-http-api](https://github.com/jishi/node-sonos-http-api)
4. 

### Installing

A step by step series of examples that tell you have to get a development env running

Say what the step will be

```
Give the example
```

And repeat

```
until finished
```

End with an example of getting some data out of the system or using it for a little demo

### Configuring

The app needs certain api keys to be configured. To do this, create a settings.json file in the root directory

```
{
  "darksky": "<insert darksky api key here>",
  "latitude": "<insert latitude of current location here>",
  "longitude": "<insert longitude of current location here>",
  "hue" : "<insert hue light key here for autodiscovery>",
  "mongoUrl": "<insert mongo database url here>"
}
```

## Built With

* [NodeJS](https://nodejs.org/en/)
* [Express](https://www.npmjs.com/package/express)
* [node-schedule](https://www.npmjs.com/package/node-schedule)
* [Mongoose](https://www.npmjs.com/package/mongoose)


## Authors

* **Sawyer Burnett** - *Initial work*

