import React, { useState } from 'react'
import { View, ScrollView } from 'react-native'
import {
  Text,
  Switch,
  Card,
  Divider,
  List,
  Button
} from 'react-native-paper'
import Slider from '@react-native-community/slider'
import { settingScreenStyles as styles } from "@/styles";

export default function SettingsScreen() {
  const [rssi, setRssi] = useState(true)
  const [rsrp, setRsrp] = useState(true)
  const [sinr, setSinr] = useState(true)
  const [qos, setQos] = useState(false)
  const [frequency, setFrequency] = useState(false)

  const [logFrequency, setLogFrequency] = useState(5)

  return (
    <ScrollView style={styles.container}>
      
      {/* PROFILE SECTION */}
      <Card style={styles.card}>
        <Card.Title title="Profile" subtitle="DrivePulse User" />
        <Card.Content>
          <Text>Email: user@drivepulse.com</Text>
          <Text>Role: Field Engineer</Text>
        </Card.Content>
      </Card>

      {/* METRICS TOGGLE SECTION */}
      <Card style={styles.card}>
        <Card.Title title="Metrics Configuration" />
        <Card.Content>

          <List.Item
            title="RSSI"
            right={() => (
              <Switch value={rssi} onValueChange={setRssi} />
            )}
          />

          <List.Item
            title="RSRP / RSRQ"
            right={() => (
              <Switch value={rsrp} onValueChange={setRsrp} />
            )}
          />

          <List.Item
            title="SINR"
            right={() => (
              <Switch value={sinr} onValueChange={setSinr} />
            )}
          />

          <List.Item
            title="QoS"
            right={() => (
              <Switch value={qos} onValueChange={setQos} />
            )}
          />

          <List.Item
            title="Frequency Info"
            right={() => (
              <Switch value={frequency} onValueChange={setFrequency} />
            )}
          />

        </Card.Content>
      </Card>

      {/* LOG FREQUENCY SLIDER */}
      <Card style={styles.card}>
        <Card.Title title="Log Frequency" />
        <Card.Content>
          <Text style={styles.sliderValue}>
            {logFrequency} seconds
          </Text>

          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={1}
            maximumValue={30}
            step={1}
            value={logFrequency}
            onValueChange={setLogFrequency}
          />

          <Text style={styles.helperText}>
            Adjust how often logs are recorded.
          </Text>
        </Card.Content>
      </Card>

      {/* DEVICE INFORMATION */}
      <Card style={styles.card}>
        <Card.Title title="Device Information" />
        <Card.Content>
          <Text>Model: Samsung Galaxy S21</Text>
          <Text>Android Version: 14</Text>
          <Text>App Version: 1.0.0</Text>
        </Card.Content>
      </Card>

      {/* SYSTEM MANAGEMENT */}
      <Card style={styles.card}>
        <Card.Title title="System Management" />
        <Card.Content>

          <Button
            mode="outlined"
            style={styles.button}
            onPress={() => console.log('Clear Logs')}
          >
            Clear All Logs
          </Button>

          <Button
            mode="outlined"
            style={styles.button}
            onPress={() => console.log('Export Data')}
          >
            Export All Data
          </Button>

          <Button
            mode="contained"
            style={styles.dangerButton}
            onPress={() => console.log('Reset System')}
          >
            Reset Application
          </Button>

        </Card.Content>
      </Card>

      <View style={{ height: 40 }} />

    </ScrollView>
  )
}
