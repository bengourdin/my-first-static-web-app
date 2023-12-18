// Import React and useState and useEffect hook
import React, { useState, useEffect } from "react";
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

const { EventHubConsumerClient, earliestEventPosition  } = require("@azure/event-hubs");

// Event hubs 
const connectionString = 'Endpoint=sb://carrerabahn-data.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=xaQOhYri8+7Tfadmj7Sfy3w8H2VWL4XXc+AEhPCts6w=';
const eventHubName = "carrerabahn-data-test2";
const consumerGroup = "$Default"; // name of the default consumer group

// Define a custom component called App
function App() {
  // Declare two state variables: temperatureTokyo and temperatureLA
  const [temperatureTokyo, setTemperatureTokyo] = useState();
  const [temperatureLA, setTemperatureLA] = useState();
  const consumerClient = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);
  console.log('starting')
  const getTemp = async () => {
    consumerClient.subscribe({
      processEvents: async (events, context) => {
        for (const event of events) {
          console.log('event comming in');
          if (event.body.City == "Tokyo") {
            setTemperatureTokyo(event.body.Temperature)
          }
          else if (event.body.City == "Los Angeles") {
            setTemperatureLA(event.body.Temperature)
          }
        }
      },
      processError: async (err, context) => {
        console.log(`Error : ${err}`);
      },
    });
  };

  useEffect(() => {
    getTemp().catch((error) => {
      console.error("Error running sample:", error);
    });
  }, []);
  
  return (
    <div>
      <h1>Temperature</h1>
        <label>
        <p>
        Tokyo: {temperatureTokyo}
        </p>
        </label>
        <label>
        <p>
        Los Angeles: {temperatureLA}
        </p>
        </label>
    </div>
  );
}

// Export the App component
export default App;
