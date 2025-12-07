import { Text, TextInput, View, ScrollView, Dimensions, StyleSheet, Pressable, Modal, Image, ActivityIndicator, Switch } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import api from "@/app/api/client";
import DataFormRecorder from "@/components/DataFormRecorder";

const { width, height } = Dimensions.get("screen");

export default function Create() {
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Dropdown state
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [matchdropdownVisible, setMatchDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Team"); // default
  const [selectedMatchOption, setSelectionMatchOption] = useState("Quals")

  const showAlert = (title: string, message: any) => {
    const msg = typeof message === "string" ? message : JSON.stringify(message, null, 2);
    setAlertTitle(title);
    setAlertMessage(msg);
    setAlertVisible(true);
  };

  const handleDropdownSelect = (option: string) => {
    setSelectedOption(option);
    setDropdownVisible(false);
  };

  const handleMatchDropdownSelect = (option: string) => {
    setSelectionMatchOption(option);
    setMatchDropdownVisible(false);
    if(option === "Playoffs"){
      matchFormData.tournament_level = "DoubleElim";
    }else{
      matchFormData.tournament_level = "Quals";
    }
    
  };

  interface ReportData {
    is_public: boolean;
    season: number;
    classified_amount_auto: number;
    overflow_amount_auto: number;
    motif_amount_auto: number;
    classified_amount_teleop: number;
    motif_amount_teleop: number;
    overflow_amount_teleop: number;
    average_collection_time?: number;
    time_to_shoot?: number;
    time_to_park?: number;
    can_deposit_close: boolean;
    can_deposit_far: boolean;
    can_park_two_robots: boolean;
    additional_info?: string;
  }

  interface MatchReportData {
    is_public: boolean;
    season: number;
    classified_amount_auto: number;
    overflow_amount_auto: number;
    motif_amount_auto: number;
    classified_amount_teleop: number;
    motif_amount_teleop: number;
    overflow_amount_teleop: number;
    average_collection_time?: number;
    shots_made_auto: number;
    shots_attempted_auto: number;
    shots_made_teleop: number;
    shots_attempted_teleop: number;
    event_code: string;
    match_number: number;
    tournament_level: string;
    team_number: number;
    additional_info?: string;
  }

  const defaultReportData: ReportData = {
    is_public: true,
    season: 2025,
    classified_amount_auto: 0,
    overflow_amount_auto: 0,
    motif_amount_auto: 0,
    classified_amount_teleop: 0,
    motif_amount_teleop: 0,
    overflow_amount_teleop: 0,
    average_collection_time: undefined,
    time_to_shoot: undefined,
    time_to_park: undefined,
    can_deposit_close: false,
    can_deposit_far: false,
    can_park_two_robots: false,
    additional_info: "",
  };

  const defaultMatchReportData: MatchReportData = {
    is_public: true,
    season: 2026,
    classified_amount_auto: 0,
    overflow_amount_auto: 0,
    motif_amount_auto: 0,
    classified_amount_teleop: 0,
    motif_amount_teleop: 0,
    overflow_amount_teleop: 0,
    shots_made_auto: 0,
    shots_attempted_auto: 0,
    shots_made_teleop: 0,
    shots_attempted_teleop: 0,
    event_code: "USCTCMP",
    match_number: 0,
    tournament_level: "Quals",
    team_number: 0,
    additional_info: "",
  };

  const [formData, setFormData] = useState<ReportData>(defaultReportData);
  const [matchFormData, setMatchFormData] = useState<MatchReportData>(defaultMatchReportData);
  const [textHeight, setTextHeight] = useState(height * 0.75 * 0.3);

  const handleDataEntry = async (form: ReportData) => {
    try {
      const response = await api.post("self_reports/", form);
      console.log("Created item:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating report:", error.response?.data || error.message.detail);
      throw error;
    }
  };

  const handleNumberInput = (field: keyof ReportData, allowDecimal = false) => (text: string) => {
    let numericText = allowDecimal ? text.replace(/[^0-9.]/g, "") : text.replace(/[^0-9]/g, "");
    if (allowDecimal) {
      const parts = numericText.split(".");
      if (parts.length > 2) numericText = parts[0] + "." + parts.slice(1).join("");
    }
    setFormData((prev) => ({
      ...prev,
      [field]: numericText === "" ? 0 : parseFloat(numericText),
    }));
  };

  const handleBooleanChange = (field: keyof ReportData) => (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDataEntryMatchReport = async (form: MatchReportData) => {
    try {
      const response = await api.post("match_reports/"+2024+"/"+form.event_code, form);
      console.log("Created item:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Error creating report:", error.response?.data || error.message);
      throw error;
    }
  };

  const onSubmit = async () => {
    if(selectedOption === "Team"){
      try {
        setLoading(true);
        const response = await handleDataEntry(formData);
        showAlert("Success!", "Report created successfully.");
      } catch (err: any) {
        console.error("Submission failed:", err);
        showAlert("Error", err.response?.data || err.message || "Failed to create report.");
      } finally {
        setLoading(false);
      }
    }else{
      try {
        setLoading(true);
        const response = await handleDataEntryMatchReport(matchFormData);
        showAlert("Success!", "Match Report created successfully.");
      } catch (err: any) {
        console.error("Submission failed:", err);
        showAlert("Error", err.response?.data.detail || err.message.detail || "Failed to create match report.");
      } finally {
        setLoading(false);
      }
    }
    
  };

  const handleAlertDismiss = () => {
    setAlertVisible(false);
    router.push(`/reports`);
  };
  // Auto period
  const [overflowCountAuto, setOverflowCountAuto] = useState(0);
  const [motifCountAuto, setMotifCountAuto] = useState(0);
  const [classifiedCountAuto, setClassifiedCountAuto] = useState(0);

  // TeleOp period
  const [overflowCountTeleop, setOverflowCountTeleop] = useState(0);
  const [classifiedCountTeleop, setClassifiedCountTeleop] = useState(0);
  const [motifCountTeleop, setMotifCountTeleop] = useState(0);

  const [eventQuery, setEventQuery] = useState("");
  


  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.infoScroll}
        showsVerticalScrollIndicator={false}   // keeps it visible
        indicatorStyle="black"                // iOS only: can be 'black' or 'white'
        scrollIndicatorInsets={{ right: 2 }}  // small padding from the edge
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Create Report</Text>
            <View style={styles.selectorView}>
              <Pressable
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => setDropdownVisible(true)}
              >
                <Text style={styles.headerText}>{selectedOption}</Text>
                <MaterialIcons name="arrow-drop-down" size={30} color="#25292e" />
              </Pressable>
            </View>
          </View>
          {/* Dropdown Modal */}
          <Modal
            visible={dropdownVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setDropdownVisible(false)}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setDropdownVisible(false)}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  width: width * 0.5,
                  paddingVertical: 10,
                }}
              >
                {["Team", "Match"].map((option) => (
                  <Pressable
                    key={option}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                    }}
                    onPress={() => handleDropdownSelect(option)}
                  >
                    <Text style={{ fontSize: 18 }}>{option}</Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>
          <Modal
            visible={matchdropdownVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setMatchDropdownVisible(false)}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setMatchDropdownVisible(false)}
            >
              <View
                style={{
                  backgroundColor: "white",
                  borderRadius: 8,
                  width: width * 0.5,
                  paddingVertical: 10,
                }}
              >
                {["Quals", "Playoffs"].map((option) => (
                  <Pressable
                    key={option}
                    style={{
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                    }}
                    onPress={() => handleMatchDropdownSelect(option)}
                  >
                    <Text style={{ fontSize: 18 }}>{option}</Text>
                  </Pressable>
                ))}
              </View>
            </Pressable>
          </Modal>
          {selectedOption === "Team" ? 
          (<>
            {/* Auto Section */}
            <View style={styles.formBody}>
              <View style={styles.simpleDataView}>
                <View style={styles.autoRowView}>
                  <Text style={styles.headerText}>Autonomous Scoring</Text>
                  <View style={styles.autoRowEntries}>
                    <View style={styles.rowEntry}>
                      <Text style={styles.dataFormHeaderText}>Classified</Text>
                      <TextInput
                        style={styles.dataInput}
                        keyboardType="numeric"
                        placeholder="0"
                        value={String(formData.classified_amount_auto || "")}
                        onChangeText={handleNumberInput("classified_amount_auto")}
                      />
                    </View>
                    <View style={styles.rowEntry}>
                      <Text style={styles.dataFormHeaderText}>Overflow</Text>
                      <TextInput
                        style={styles.dataInput}
                        keyboardType="numeric"
                        placeholder="0"
                        value={String(formData.overflow_amount_auto || "")}
                        onChangeText={handleNumberInput("overflow_amount_auto")}
                      />
                    </View>
                    <View style={styles.rowEntry}>
                      <Text style={styles.dataFormHeaderText}>Motif Count</Text>
                      <TextInput
                        style={styles.dataInput}
                        keyboardType="numeric"
                        placeholder="0"
                        value={String(formData.motif_amount_auto || "")}
                        onChangeText={handleNumberInput("motif_amount_auto")}
                      />
                    </View>
                  </View>
                </View>

                {/* TeleOp Section */}
                <View style={styles.teleOpRowView}>
                  <Text style={styles.headerText}>Tele-Op Scoring</Text>
                  <View style={styles.teleOpRowEntries}>
                    <View style={styles.rowEntry}>
                      <Text style={styles.dataFormHeaderText}>Classified</Text>
                      <TextInput
                        style={styles.dataInput}
                        keyboardType="numeric"
                        placeholder="0"
                        value={String(formData.classified_amount_teleop || "")}
                        onChangeText={handleNumberInput("classified_amount_teleop")}
                      />
                    </View>
                    <View style={styles.rowEntry}>
                      <Text style={styles.dataFormHeaderText}>Overflow</Text>
                      <TextInput
                        style={styles.dataInput}
                        keyboardType="numeric"
                        placeholder="0"
                        value={String(formData.overflow_amount_teleop || "")}
                        onChangeText={handleNumberInput("overflow_amount_teleop")}
                      />
                    </View>
                    <View style={styles.rowEntry}>
                      <Text style={styles.dataFormHeaderText}>Motif Count</Text>
                      <TextInput
                        style={styles.dataInput}
                        keyboardType="numeric"
                        placeholder="0"
                        value={String(formData.motif_amount_teleop || "")}
                        onChangeText={handleNumberInput("motif_amount_teleop")}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Heatmap Section */}
              <View style={styles.heatMapView}>
                <View style={styles.heatMapHeader}>
                  <Text style={{ fontSize: 24 }}>Heat Map</Text>
                  {/* <MaterialIcons name="arrow-drop-down" size={30} color="#25292e" /> */}
                </View>
                <View style={styles.heatMapContainer}>
                  <Pressable>
                    <Image source={require("@/assets/images/FTCfield.png")} style={styles.image} />
                  </Pressable>
                </View>
                <View style={styles.heatMapButtonView}>
                  <Text style={styles.headerText}>Coming Soon!</Text>
                </View>
              </View>
            </View>

            {/* Advanced Metrics */}
            <View style={styles.advancedInfo}>
              <Text style={styles.headerText}>Advanced Metrics</Text>

              {/* Numeric Fields */}
              <View style={styles.advancedRowEntries}>
                <View style={styles.advancedRowEntry}>
                  <Text style={styles.dataFormHeaderText}>Avg. Collection Time</Text>
                  <TextInput
                    style={styles.dataInput}
                    keyboardType="numeric"
                    placeholder="0"
                    value={String(formData.average_collection_time || "")}
                    onChangeText={handleNumberInput("average_collection_time", true)}
                  />
                </View>
                <View style={styles.advancedRowEntry}>
                  <Text style={styles.dataFormHeaderText}>Time to Shoot</Text>
                  <TextInput
                    style={styles.dataInput}
                    keyboardType="numeric"
                    placeholder="0"
                    value={String(formData.time_to_shoot || "")}
                    onChangeText={handleNumberInput("time_to_shoot", true)}
                  />
                </View>
                <View style={styles.advancedRowEntry}>
                  <Text style={styles.dataFormHeaderText}>Time to Park</Text>
                  <TextInput
                    style={styles.dataInput}
                    keyboardType="numeric"
                    placeholder="0"
                    value={String(formData.time_to_park || "")}
                    onChangeText={handleNumberInput("time_to_park", true)}
                  />
                </View>
              </View>

              {/* Switch Toggles */}
              <View style={styles.toggleSection}>
                <View style={styles.toggleEntry}>
                  <Text style={styles.dataFormHeaderText}>Can Deposit Close?</Text>
                  <Switch
                    value={formData.can_deposit_close}
                    onValueChange={handleBooleanChange("can_deposit_close")}
                    thumbColor={formData.can_deposit_close ? "#4CAF50" : "#f4f3f4"}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                  />
                </View>
                <View style={styles.toggleEntry}>
                  <Text style={styles.dataFormHeaderText}>Can Deposit Far?</Text>
                  <Switch
                    value={formData.can_deposit_far}
                    onValueChange={handleBooleanChange("can_deposit_far")}
                    thumbColor={formData.can_deposit_far ? "#4CAF50" : "#f4f3f4"}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                  />
                </View>
                <View style={styles.toggleEntry}>
                  <Text style={styles.dataFormHeaderText}>Can Park Two Robots?</Text>
                  <Switch
                    value={formData.can_park_two_robots}
                    onValueChange={handleBooleanChange("can_park_two_robots")}
                    thumbColor={formData.can_park_two_robots ? "#4CAF50" : "#f4f3f4"}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                  />
                </View>
              </View>

              {/* Additional Info */}
              <View style={styles.additionalInfoSection}>
                <Text style={styles.headerText}>Additional Information</Text>
                <TextInput
                  style={[styles.additionalInput, { height: textHeight }]}
                  placeholder="Add any notes or observations..."
                  placeholderTextColor="#555"
                  multiline
                  onContentSizeChange={(e) => setTextHeight(e.nativeEvent.contentSize.height)}
                  value={formData.additional_info}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, additional_info: text }))
                  }
                />
              </View>
            </View>
            </>
            ):(<>
              <View style={styles.matchBody}>
                <Text style={styles.headerText}>
                  Match Info
                </Text>
                <View style={styles.matchSearchParams}>
                  <View style={styles.eventSearch}>
                    <Text style={styles.paramHeaderText}>
                      Event
                    </Text>
                    <View style={styles.searchBox}>
                      <TextInput
                        placeholder="Search Event Code"
                        value={String(matchFormData.event_code)}
                        onChangeText={(val) =>
                            setMatchFormData((prev) => ({ ...prev, event_code: val }))
                        }
                        autoCapitalize="words"
                        style={styles.matchSearchBox}
                      />
                      <MaterialIcons name="search" size={30} color="#25292e" />
                    </View>
                  </View>
                  <View style={styles.matchSearch}>
                    <Text style={styles.paramHeaderText}>
                      Match Number
                    </Text>
                    <View style={{flexDirection: "row", justifyContent: "space-between", width: width *0.18}}>
                      <View style={styles.selectorView}>
                        <Pressable
                          style={{ flexDirection: "row", alignItems: "center" }}
                          onPress={() => setMatchDropdownVisible(true)}
                        >
                          <Text style={styles.paramHeaderText}>{selectedMatchOption}</Text>
                          <MaterialIcons name="arrow-drop-down" size={30} color="#25292e" />
                        </Pressable>
                      </View>
                      <View style={styles.searchBox}>
                        <TextInput
                          placeholder="Match Number"
                          keyboardType="number-pad"
                          value={String(matchFormData.match_number)}
                          onChangeText={(val) =>
                              setMatchFormData((prev) => ({
                                  ...prev,
                                  match_number: Number.parseInt(val.replace(/[^0-9]/g, '')) // remove anything that's not a digit
                              }))
                          }
                          style={styles.matchSearchBox}
                        />
                        <MaterialIcons name="search" size={30} color="#25292e" />
                      </View>
                    </View>
                  </View>
                  <View style={styles.teamSearch}>
                    <Text style={styles.paramHeaderText}>
                      Team
                    </Text>
                    <View style={styles.searchBox}>
                      <TextInput
                        placeholder="Team Number"
                          keyboardType="number-pad"
                          value={String(matchFormData.team_number)}
                          onChangeText={(val) =>
                              setMatchFormData((prev) => ({
                                  ...prev,
                                  team_number: Number.parseInt(val.replace(/[^0-9]/g, '')) // remove anything that's not a digit
                              }))
                          }
                          style={styles.matchSearchBox}
                      />
                      <MaterialIcons name="search" size={30} color="#25292e" />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.formBody}>
                <View style={styles.simpleDataView}>
                  <View style={styles.autoRowView}>
                    <Text style={styles.headerText}>Autonomous Scoring</Text>
                    <View style={styles.advancedRowEntries}>
                      <View style={styles.rowEntry}>
                        <Text style={styles.dataFormHeaderText}>Classified</Text>
                        <DataFormRecorder 
                          value={matchFormData.classified_amount_auto}          
                          onChange={(val) =>
                            setMatchFormData((prev) => ({ ...prev, classified_amount_auto: val }))
                          }
                        />
                        
                      </View>
                      <View style={styles.rowEntry}>
                        <Text style={styles.dataFormHeaderText}>Overflow</Text>
                        <DataFormRecorder 
                          value={matchFormData.overflow_amount_auto}          
                          onChange={(val) =>
                            setMatchFormData((prev) => ({ ...prev, overflow_amount_auto: val }))
                          }
                        />
                      </View>
                      <View style={styles.rowEntry}>
                        <Text style={styles.dataFormHeaderText}>Motif Count</Text>
                        <DataFormRecorder 
                          value={matchFormData.motif_amount_auto}          
                          onChange={(val) =>
                            setMatchFormData((prev) => ({ ...prev, motif_amount_auto: val }))
                          }
                        />
                      </View>
                    </View>
                  </View>

                  {/* TeleOp Section */}
                  <View style={styles.teleOpRowView}>
                    <Text style={styles.headerText}>Tele-Op Scoring</Text>
                    <View style={styles.teleOpRowEntries}>
                      <View style={styles.rowEntry}>
                        <Text style={styles.dataFormHeaderText}>Classified</Text>
                        <DataFormRecorder 
                          value={matchFormData.classified_amount_teleop}          
                          onChange={(val) =>
                            setMatchFormData((prev) => ({ ...prev, classified_amount_teleop: val }))
                          }
                        />
                      </View>
                      <View style={styles.rowEntry}>
                        <Text style={styles.dataFormHeaderText}>Overflow</Text>
                        <DataFormRecorder 
                          value={matchFormData.overflow_amount_teleop}          
                          onChange={(val) =>
                            setMatchFormData((prev) => ({ ...prev, overflow_amount_teleop: val }))
                          }
                        />
                      </View>
                      <View style={styles.rowEntry}>
                        <Text style={styles.dataFormHeaderText}>Motif Count</Text>
                        <DataFormRecorder 
                          value={matchFormData.motif_amount_teleop}          
                          onChange={(val) =>
                            setMatchFormData((prev) => ({ ...prev, motif_amount_teleop: val }))
                          }
                        />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Heatmap Section */}
                <View style={styles.heatMapView}>
                  <View style={styles.heatMapHeader}>
                    <Text style={{ fontSize: 24 }}>Heat Map</Text>
                    {/* <MaterialIcons name="arrow-drop-down" size={30} color="#25292e" /> */}
                  </View>
                  <View style={styles.heatMapContainer}>
                    <Pressable>
                      <Image source={require("@/assets/images/FTCfield.png")} style={styles.image} />
                    </Pressable>
                  </View>
                  <View style={styles.heatMapButtonView}>
                    <Text style={styles.headerText}>Coming Soon!</Text>
                  </View>
                </View>
              </View>

              <View style={styles.matchInfo}>
                <Text style={styles.headerText}>Advanced Metrics</Text>
                <View style={styles.advancedMatchRowEntries}>
                  <View style={styles.rowEntry}>
                    <Text style={styles.dataFormHeaderText}>Shots made in auto</Text>
                    <DataFormRecorder
                      value={matchFormData.shots_made_auto}
                      onChange={(val) =>
                        setMatchFormData((prev) => ({ ...prev, shots_made_auto: val }))
                      }
                    />
                  </View>
                  <View style={styles.rowEntry}>
                    <Text style={styles.dataFormHeaderText}>Shots attempted in auto</Text>
                    <DataFormRecorder
                      value={matchFormData.shots_attempted_auto}
                      onChange={(val) =>
                        setMatchFormData((prev) => ({ ...prev, shots_attempted_auto: val }))
                      }
                    />
                  </View>
                  <View style={styles.rowEntry}>
                    <Text style={styles.dataFormHeaderText}>Shots made in teleop</Text>
                    <DataFormRecorder
                      value={matchFormData.shots_made_teleop}
                      onChange={(val) =>
                        setMatchFormData((prev) => ({ ...prev, shots_made_teleop: val }))
                      }
                    />
                  </View>
                  <View style={styles.rowEntry}>
                    <Text style={styles.dataFormHeaderText}>Shots attempted in teleop</Text>
                    <DataFormRecorder
                      value={matchFormData.shots_attempted_teleop}
                      onChange={(val) =>
                        setMatchFormData((prev) => ({ ...prev, shots_attempted_teleop: val }))
                      }
                    />
                  </View>
                </View>
                
              </View>
            </>
          )}
          
        </View>
      </ScrollView>

      <Pressable style={styles.createButton} onPress={onSubmit}>
        <View style={styles.button}>
          <Text style={styles.headerText}>Create Report</Text>
        </View>
      </Pressable>

      <Modal
        visible={alertVisible}
        transparent
        animationType="fade"
        onRequestClose={handleAlertDismiss}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}>
          <View style={{
            width: "80%",
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            alignItems: "center",
          }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>{alertTitle}</Text>
            <Text style={{ fontSize: 16, marginBottom: 20 }}>{alertMessage}</Text>
            <Pressable
              style={{
                backgroundColor: "#007AFF",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 8,
              }}
              onPress={handleAlertDismiss}
            >
              <Text style={{ color: "white", fontSize: 16 }}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const formBodyHeight = 0.7;
const advancedInfoHeight = 0.3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF9F1" },
  infoScroll: { flex: 1, paddingBottom: 75 },
  header: {
    height: height * 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: width * 0.025,
    paddingRight: width * 0.025,
  },
  selectorView: { flexDirection: "row", alignItems: "center" },
  headerText: { fontSize: 24 },
  dataFormHeaderText: { fontSize: 18, textAlign: "center" },
  formBody: {
    height: height * formBodyHeight,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: width * 0.025,
    paddingRight: width * 0.025,
  },
  simpleDataView: {
    height: height * formBodyHeight,
    width: width * 0.55,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: height * formBodyHeight * 0.1,
  },
  autoRowView: { height: height * 0.4 * formBodyHeight, justifyContent: "space-between" },
  autoRowEntries: {
    height: height * 0.4 * 0.5,
    width: width * 0.55,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  teleOpRowView: { 
    height: height * 0.4 * formBodyHeight, 
    justifyContent: "space-between", 
  },
  teleOpRowEntries: {
    height: height * 0.4 * 0.5,
    width: width * 0.55,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowEntry: {
    height: height * 0.4 * 0.5,
    width: width * 0.55 * 0.25,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  dataInput: {
    width: width * 0.55 * 0.25 * 0.5,
    height: height * 0.4 * 0.5 * 0.6,
    textAlign: "center",
    backgroundColor: "#d3d3d3ff",
    borderRadius: 15,
  },
  heatMapView: {
    height: height * formBodyHeight,
    width: width * 0.4,
    flexDirection: "column",
  },
  heatMapHeader: {
    height: height * 0.15 * formBodyHeight,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  heatMapContainer: { height: height * 0.65 * formBodyHeight, alignItems: "center" },
  image: {
    width: height * 0.65 * formBodyHeight,
    height: height * 0.65 * formBodyHeight,
    resizeMode: "contain",
  },
  heatMapButtonView: {
    height: height * 0.2 * formBodyHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  advancedInfo: {
    paddingHorizontal: width * 0.025,
    paddingBottom: height * 0.05,
    marginTop: 10,
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  advancedRowView: { height: height * advancedInfoHeight, justifyContent: "space-between" },
  advancedRowEntries: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: width * 0.555,
  },
  advancedRowEntry: {
    height: height * 0.4 * 0.5,
    width: width * 0.55 * 0.275,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
  },
  advancedMatchRowEntries: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: width * 0.95,
  },
  additionalInfoView: {
    height: height * 0.3,
    paddingLeft: width * 0.025,
    paddingRight: width * 0.025,
    paddingTop: height * 0.02,
    justifyContent: "space-between",
  },
  textBox: {
    backgroundColor: "#afafafff",
    borderRadius: 10,
    padding: 5,
  },
  createButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: "#ffd28fff",
    width: width * 0.2,
    height: 75,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  toggleRow: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-around",
    height: height * 0.25, // give space to show switches
    marginTop: 10,
  },
  toggleSection: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: "column",
    gap: 10,
  },

  toggleEntry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 5,
  },

  additionalInfoSection: {
    marginTop: 15,
    flexDirection: "column",
  },

  additionalInput: {
    fontSize: 16,
    textAlignVertical: "top",
    padding: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    minHeight: height * 0.15,
  },
  
  matchInfo: {
    paddingHorizontal: width * 0.025,
    paddingBottom: height * 0.05,
    marginTop: 10,
    height: height * 0.3,
    flexDirection: "column",
    justifyContent: "flex-start",
  },

  matchBody: {
    height: height * 0.175,
    paddingLeft: width * 0.025,
    paddingRight: width * 0.025,
    
  },

  matchSearchParams: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: height * 0.03,
    paddingRight: width * 0.075
  },

  paramHeaderText: {
    fontSize: 18
  },

  eventSearch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.15,
        
  },

  matchSearch:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.32,
  },

  matchSearchBox:{
    width: width * 0.075,
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  thinMatchSearchBox:{
    
  },

  teamSearch:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: width * 0.15,
  },

  searchBox: {
    width: width * 0.1,
    flexDirection: "row",
    borderBottomWidth: 2,
  },

});
