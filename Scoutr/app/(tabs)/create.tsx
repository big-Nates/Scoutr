import { Text, TextInput, View, ScrollView, Dimensions, StyleSheet, Pressable, Modal, Image, ActivityIndicator, Switch } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import api from "@/app/api/client";
import DataFormRecorder from "@/components/DataFormRecorder";

const { width, height } = Dimensions.get("screen");

export default function Create() {
  const [userTeamNumber, setUserTeamNumber] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  //Report Data States
  interface ReportData {
    is_public: boolean;
    season: number;
    team_number: number;
    classified_amount_auto: number;
    overflow_amount_auto: number;
    motif_amount_auto: number;
    classified_amount_teleop: number;
    motif_amount_teleop: number;
    overflow_amount_teleop: number;
    starting_position: string;
    collection_position: string;
    scoring_position: string;
    can_park_two_robots: boolean;
    additional_info: string;
  }

  const defaultReportData: ReportData = {
    is_public: true,
    season: 2025,
    team_number: 0,
    classified_amount_auto: 0,
    overflow_amount_auto: 0,
    motif_amount_auto: 0,
    classified_amount_teleop: 0,
    motif_amount_teleop: 0,
    overflow_amount_teleop: 0,
    starting_position: "",
    collection_position: "",
    scoring_position: "",
    can_park_two_robots: false,
    additional_info: "",
  };

  const setNoAutonomous = () =>{
    handleNumberInput("classified_amount_auto")("0");
    handleNumberInput("overflow_amount_auto")("0");
    handleNumberInput("motif_amount_auto")("0");
  }

  const [scoreBonus, setScoreBonus] = useState(0);

  const fetchUserData = async () => {
      try {
        const data = await api.get("users/me");;
        setUserTeamNumber(data.data.team_number);
      } catch (err) {
        console.error("Error fetching user team number:", err);
      } finally {
        setLoading(false);
      }
    };
  useEffect(() => {
    fetchUserData();
  }, []);

  const [formData, setFormData] = useState<ReportData>(defaultReportData);

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

  const setAscentBonus = () => {
    handleBooleanChange("can_park_two_robots")(!formData.can_park_two_robots); 
    if(!formData.can_park_two_robots){
      setScoreBonus(15);
    }else{
      setScoreBonus(0);
    }
  }


  // Dropdown state
  const [selectedOption, setSelectedOption] = useState("Team"); 
  type ActiveModal = "none" | "reportType" | "startingPosMap" | "collectionPosMap" | "scoringPosMap";
  const [activeModal, setActiveModal] = useState<ActiveModal>("none");
  const handleDropdownSelect = (option: string) => {
    setSelectedOption(option);
    setActiveModal("none");
  };
  
  const startPoses = ['Close Zone', 'Far Zone'];
  const [chosenStart, setChosenStart] = useState(0);
  const [tempChosenStart, tempSetChosenStart] = useState(0);
  const handleStartPosesSelect = (increment: boolean) => {
    if(increment){
      if(tempChosenStart !== 1){
        tempSetChosenStart(prevCount => prevCount + 1);
      }else{
        tempSetChosenStart(0);
      }
    }else{
      if(tempChosenStart !== 0){
        tempSetChosenStart(prevCount => prevCount - 1);
      }else{
        tempSetChosenStart(1);
      }
    }
  };
  const handleStartPoseConfirmation = () => {
    setChosenStart(tempChosenStart);
    setActiveModal("none");
  }

  const collectionPoses = ['Human Player', 'Secret Tunnel', "Classifier"];
  const [chosenCollection, setCollection] = useState(0);
  const [tempChosenCollection, tempSetCollection] = useState(0);
  const handleCollectionPosesSelect = (increment: boolean) => {
    if(increment){
      if(tempChosenCollection !== 2){
        tempSetCollection(prevCount => prevCount + 1);
      }else{
        tempSetCollection(0);
      }
    }else{
      if(tempChosenCollection !== 0){
        tempSetCollection(prevCount => prevCount - 1);
      }else{
        tempSetCollection(1);
      }
    }
  };
  const handleCollectionPoseConfirmation = () => {
    setCollection(tempChosenCollection);
    setActiveModal("none");
  }

  const scoringPoses = ['Close Zone', 'Far Zone'];
  const [chosenScoring, setChosenScoring] = useState(0);
  const [tempChosenScoring, tempSetChosenScoring] = useState(0);
  const handleScoringPosesSelect = (increment: boolean) => {
    if(increment){
      if(tempChosenScoring !== 1){
        tempSetChosenScoring(prevCount => prevCount + 1);
      }else{
        tempSetChosenScoring(0);
      }
    }else{
      if(tempChosenScoring !== 0){
        tempSetChosenScoring(prevCount => prevCount - 1);
      }else{
        tempSetChosenScoring(1);
      }
    }
  };
  const handleScoringPoseConfirmation = () => {
    setChosenScoring(tempChosenScoring);
    setActiveModal("none");
  }

  
  

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
        showsVerticalScrollIndicator={false}   
        indicatorStyle="black"                
        scrollIndicatorInsets={{ right: 2 }}  
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.selectorView}>
              <Pressable
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => setActiveModal("reportType")}
              >
                <Text style={styles.headerText}>{selectedOption}</Text>
                <MaterialIcons name="arrow-drop-down" size={30} color="#25292e" />
              </Pressable>
            </View>
          </View>
          {/* Dropdown Modal */}
          <Modal
            visible={activeModal === "reportType"}
            transparent
            animationType="fade"
            onRequestClose={() => setActiveModal("none")}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setActiveModal("none")}
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
            visible={activeModal === "startingPosMap"}
            transparent
            animationType="fade"
            onRequestClose={() => setActiveModal("none")}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setActiveModal("none")}
            >
              <View style={styles.startingPosModalView}>
                <View style={styles.startingPosModalHeader}>
                  <Text style={{fontSize: 20}}>
                    Starting Positions
                  </Text>
                </View>
                <View style={styles.selectorView}>
                  <Pressable onPress={()=>handleStartPosesSelect(false)}>
                    <MaterialIcons name="keyboard-arrow-left" size={50}/>
                  </Pressable>
                  
                  <Image source={require("@/assets/images/FTCfield.png")} style={styles.startingPosModalImage}/>
                  <Pressable onPress={()=>handleStartPosesSelect(true)}>
                    <MaterialIcons name="keyboard-arrow-right" size={50}/>
                  </Pressable>
                </View>
                <View>
                  <Text style={{fontSize: 18}}>
                    {startPoses[tempChosenStart]}
                  </Text>
                </View>
                <Pressable 
                style={styles.startingPosConfirmButton}
                onPress={()=>handleStartPoseConfirmation()}
                >
                  <Text style={{fontSize: 20}}>
                    Confirm
                  </Text>
                </Pressable>               
              </View>
            </Pressable>
          </Modal>

          <Modal 
            visible={activeModal === "collectionPosMap"}
            transparent
            animationType="fade"
            onRequestClose={() => setActiveModal("none")}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setActiveModal("none")}
            >
              <View style={styles.startingPosModalView}>
                <View style={styles.startingPosModalHeader}>
                  <Text style={{fontSize: 20}}>
                    Starting Positions
                  </Text>
                </View>
                <View style={styles.selectorView}>
                  <Pressable onPress={()=>handleCollectionPosesSelect(false)}>
                    <MaterialIcons name="keyboard-arrow-left" size={50}/>
                  </Pressable>
                  
                  <Image source={require("@/assets/images/FTCfield.png")} style={styles.startingPosModalImage}/>
                  <Pressable onPress={()=>handleCollectionPosesSelect(true)}>
                    <MaterialIcons name="keyboard-arrow-right" size={50}/>
                  </Pressable>
                </View>
                <View>
                  <Text style={{fontSize: 18}}>
                    {collectionPoses[tempChosenCollection]}
                  </Text>
                </View>
                <Pressable 
                style={styles.startingPosConfirmButton}
                onPress={()=>handleCollectionPoseConfirmation()}
                >
                  <Text style={{fontSize: 20}}>
                    Confirm
                  </Text>
                </Pressable>               
              </View>
            </Pressable>
          </Modal>

          <Modal 
            visible={activeModal === "scoringPosMap"}
            transparent
            animationType="fade"
            onRequestClose={() => setActiveModal("none")}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => setActiveModal("none")}
            >
              <View style={styles.startingPosModalView}>
                <View style={styles.startingPosModalHeader}>
                  <Text style={{fontSize: 20}}>
                    Starting Positions
                  </Text>
                </View>
                <View style={styles.selectorView}>
                  <Pressable onPress={()=>handleScoringPosesSelect(false)}>
                    <MaterialIcons name="keyboard-arrow-left" size={50}/>
                  </Pressable>
                  
                  <Image source={require("@/assets/images/FTCfield.png")} style={styles.startingPosModalImage}/>
                  <Pressable onPress={()=>handleScoringPosesSelect(true)}>
                    <MaterialIcons name="keyboard-arrow-right" size={50}/>
                  </Pressable>
                </View>
                <View>
                  <Text style={{fontSize: 18}}>
                    {scoringPoses[tempChosenScoring]}
                  </Text>
                </View>
                <Pressable 
                style={styles.startingPosConfirmButton}
                onPress={()=>handleScoringPoseConfirmation()}
                >
                  <Text style={{fontSize: 20}}>
                    Confirm
                  </Text>
                </Pressable>               
              </View>
            </Pressable>
          </Modal>
          
          {selectedOption === "Team" ? 
          (<>
            <View style={styles.teamReportInfoView}>
              <View 
                style={formData.is_public ? styles.privacyView : styles.privacyViewGrayed}
              >
                <Pressable
                  onPress={() =>
                    handleBooleanChange("is_public")(true)
                  }
                >
                  <View style={styles.privacyViewLeft}>
                    <Text style={{fontSize: 16}}>
                      Public
                    </Text>
                  </View>
                </Pressable>

                <Pressable
                  onPress={() =>
                    handleBooleanChange("is_public")(false)
                  }
                >
                  <View 
                    style={formData.is_public ? styles.privacyViewRight : styles.privacyViewRightSelected}
                  >
                    <Text style={{fontSize: 16}}>
                      Private
                    </Text>
                  </View>
                </Pressable>
              </View>
              <View style={styles.teamNumberView}>
                <Text style={{fontSize: 20}}>
                  Team Search
                </Text>
                <View style={{borderBottomWidth: 1}}>
                  <TextInput
                    placeholder="Enter a Team Number"
                    placeholderTextColor={"gray"}
                    style={{fontSize:16}}
                    keyboardType="numeric"
                    value={String(formData.team_number || "")}
                    onChangeText={handleNumberInput("team_number")}
                  />
                </View>
              </View>
              
              <Pressable 
                style={styles.selfReportButton}
                onPress={()=>{handleNumberInput("team_number")(String(userTeamNumber))}}
              >
                <Text style={{fontSize: 16}}>
                  Self Report
                </Text>
              </Pressable>
            </View>
            </>
          ):(<>
            <View style={styles.matchReportInfoView}>
              <View style={styles.privacyView}>
                <View style={styles.privacyViewLeft}>
                  <Text style={{fontSize: 16}}>
                    Public
                  </Text>
                </View>
                <View style={styles.privacyViewRight}>
                  <Text style={{fontSize: 16}}>
                    Private
                  </Text>
                </View>
              </View>
              <View style={styles.matchReportDetailsScrollView}>
                <ScrollView
                  horizontal={true}
                >
                  <View style={styles.teamNumberView}>
                    <Text style={{fontSize: 20}}>
                      Event Search
                    </Text>
                    <View style={{borderBottomWidth: 1}}>
                      <TextInput
                        placeholder="Enter an Event Code"
                        style={{fontSize:16}}
                      />
                    </View>
                  </View>
                  <View style={styles.teamNumberView}>
                    <Text style={{fontSize: 20}}>
                      Team Search
                    </Text>
                    <View style={{borderBottomWidth: 1}}>
                      
                      <TextInput
                        placeholder="Enter a Team Number"
                        style={{fontSize:16}}
                      />
                    </View>
                  </View>

                  <View style={styles.teamNumberView}>
                    <Text style={{fontSize: 20}}>
                      Match Number
                    </Text>
                    <View style={{ flexDirection: "row", alignItems: "center"}}>
                      <Text style={{paddingRight: width * 0.45 * 0.025, fontSize: 16}}>
                        Quals
                      </Text>
                      <MaterialIcons style={{paddingRight: width * 0.45 * 0.1, fontSize: 16}} name="arrow-drop-down" size={16} />
                      <TextInput
                        placeholder="Match #"
                        style={{fontSize:16, width: width *0.45 * 0.4, borderBottomWidth: 1}}
                      />
                    </View>
                  </View>
                  
                </ScrollView>
              </View>
            </View>
            </>
          )}

          <View style={styles.autoRecordView}>
            <View style={styles.headerView}>
              <Text style={{fontSize:20}}>
                Autonomous Scoring
              </Text>
              <Pressable 
                style={styles.autoCheckBoxButton}
                onPress={()=>{setNoAutonomous()}}
              >
                <Text>
                  No Autonomous
                </Text>
                {!(formData.motif_amount_auto === 0 && formData.overflow_amount_auto === 0 && formData.classified_amount_auto === 0) &&<MaterialIcons name="check-box-outline-blank" size={20}/>}
                {formData.motif_amount_auto === 0 && formData.overflow_amount_auto === 0 && formData.classified_amount_auto === 0 &&<MaterialIcons name="check-box" size={20}/>}
              </Pressable>
            </View>
            <View style={styles.dataScrollView}>
              <ScrollView 
              horizontal={true}
              >
                <View style={styles.dataView}>
                  <Text style={{fontSize: 20}}>
                    Classified
                  </Text>
                  <TextInput 
                    style={styles.dataTextInput}
                    keyboardType="numeric"
                    placeholder="Record here"
                    placeholderTextColor="grey"
                    value={String(formData.classified_amount_auto || "")}
                    onChangeText={handleNumberInput("classified_amount_auto")}
                  />
                </View>
                <View style={styles.dataView}>
                  <Text style={{fontSize: 20}}>
                    Overflow
                  </Text>
                  <TextInput 
                    style={styles.dataTextInput}
                    placeholder="Record here"
                    placeholderTextColor="grey"
                    keyboardType="numeric"
                    value={String(formData.overflow_amount_auto || "")}
                    onChangeText={handleNumberInput("overflow_amount_auto")}
                  />
                </View>
                <View style={styles.dataView}>
                  <Text style={{fontSize: 20}}>
                    Motif Count
                  </Text>
                  <TextInput 
                    style={styles.dataTextInput}
                    placeholder="Record here"
                    placeholderTextColor="grey"
                    keyboardType="numeric"
                    value={String(formData.motif_amount_auto || "")}
                    onChangeText={handleNumberInput("motif_amount_auto")}
                  />
                </View>
              </ScrollView>
            </View>
            
            <Text style={{fontSize:20}}>
              {formData.classified_amount_auto * 3 + formData.overflow_amount_auto + formData.motif_amount_auto * 2} Points
            </Text>
            
          </View>

          <View style={styles.teleopRecordView}>
            <View style={styles.teleopHeaderView}>
              <Text style={{fontSize:20}}>
                Teleop Scoring
              </Text>
              <Pressable 
                style={styles.teleopCheckBoxButton}
                onPress={()=>{setAscentBonus()}}
              >
                <Text>
                  Two Robot Ascent
                </Text>
                {!formData.can_park_two_robots &&<MaterialIcons name="check-box-outline-blank" size={20}/>}
                {formData.can_park_two_robots &&<MaterialIcons name="check-box" size={20}/>}
              </Pressable>
            </View>
            <View style={styles.dataScrollView}>
              <ScrollView 
              horizontal={true}
              >
                <View style={styles.dataView}>
                  <Text style={{fontSize: 20}}>
                    Classified
                  </Text>
                  <TextInput 
                    style={styles.dataTextInput}
                    placeholder="Record here"
                    placeholderTextColor="grey"
                    keyboardType="numeric"
                    value={String(formData.classified_amount_teleop || "")}
                    onChangeText={handleNumberInput("classified_amount_teleop")}
                  />
                </View>
                <View style={styles.dataView}>
                  <Text style={{fontSize: 20}}>
                    Overflow
                  </Text>
                  <TextInput 
                    style={styles.dataTextInput}
                    placeholder="Record here"
                    placeholderTextColor="grey"
                    keyboardType="numeric"
                    value={String(formData.overflow_amount_teleop || "")}
                    onChangeText={handleNumberInput("overflow_amount_teleop")}
                  />
                </View>
                <View style={styles.dataView}>
                  <Text style={{fontSize: 20}}>
                    Motif Count
                  </Text>
                  <TextInput 
                    style={styles.dataTextInput}
                    placeholder="Record here"
                    placeholderTextColor="grey"
                    keyboardType="numeric"
                    value={String(formData.motif_amount_teleop || "")}
                    onChangeText={handleNumberInput("motif_amount_teleop")}
                  />
                </View>
              </ScrollView>
            </View>
            
            <Text style={{fontSize:20}}>
              {formData.classified_amount_teleop * 3 + formData.overflow_amount_teleop + formData.motif_amount_teleop * 2 + scoreBonus} Points
            </Text>
          </View>

          <View style={styles.totalScoreView}>
            <Text style={{fontSize:20}}>{}
              {formData.classified_amount_auto * 3 + formData.overflow_amount_auto + formData.motif_amount_auto * 2 + formData.classified_amount_teleop * 3 + formData.overflow_amount_teleop + formData.motif_amount_teleop * 2 + scoreBonus} Points Total
            </Text>
          </View>

          {selectedOption === "Team" ? 
          (<>
            <View style={styles.teamPositionsView}>
              <View style={styles.teamPositionsHeaderView}>
                <Text style={{fontSize: 20}}>
                  Team Positions
                </Text>
              </View>
              <ScrollView
              style={styles.teamPositionScrollView}
              horizontal={true}
              >

                <View style={styles.teamPositionView}>
                  <View style={styles.teamPositionViewHeader}>
                    <Text style={{fontSize: 18}}>
                      Starting Position
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setActiveModal("startingPosMap")}
                  >
                    <Image source={require("@/assets/images/FTCfield.png")} style={styles.teamPositionViewMap}/>
                  </Pressable>
                  <View style={styles.teamPositionCaption}>
                    <Text style={{fontSize: 18}}>
                      {startPoses[chosenStart]}
                    </Text>
                  </View>
                </View>

                <View style={styles.teamPositionView}>
                  <View style={styles.teamPositionViewHeader}>
                    <Text style={{fontSize: 16}}>
                      Collection Position
                    </Text>
                  </View>
                  <Pressable
                    onPress={()=>{setActiveModal("collectionPosMap")}}
                  >
                    <Image source={require("@/assets/images/FTCfield.png")} style={styles.teamPositionViewMap}/>
                  </Pressable>
                  <View style={styles.teamPositionCaption}>
                    <Text style={{fontSize: 18}}>
                      {collectionPoses[chosenCollection]}
                    </Text>
                  </View>
                </View>

                <View style={styles.finalteamPositionView}>
                  <View style={styles.teamPositionViewHeader}>
                    <Text style={{fontSize: 18}}>
                      Scoring Position
                    </Text>
                  </View>
                  <Pressable
                    onPress={()=>{setActiveModal("scoringPosMap")}}
                  >
                    <Image source={require("@/assets/images/FTCfield.png")} style={styles.teamPositionViewMap}/>
                  </Pressable>
                  <View style={styles.teamPositionCaption}>
                    <Text style={{fontSize: 18}}>
                      {scoringPoses[chosenScoring]}
                    </Text>
                  </View>
                </View>
                
              </ScrollView>
            </View>
            </>
          ):(<>
              
            </>
          )}

          <View style={styles.additionalInfo}>
            <View style={styles.additionalInfoHeaderView}>
              <Text style={{fontSize: 20}}>
                Additional Information
              </Text>
            </View>
            <TextInput
              multiline
              textAlignVertical="top"
              placeholder={`Enter additional notes on team #${formData.team_number}`}
              placeholderTextColor="grey"
              style={styles.additionalInfoBodyView}
              value={String(formData.additional_info || "")}
              onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, additional_info: text }))
                  }
            />
          </View>
          
        </View>
        
      </ScrollView>
      <Pressable
        style={styles.confirmReport}
      >
        <Text style={{fontSize: 25}}>
          Create Report
        </Text>
      </Pressable>
    </View>
  );
}

const formBodyHeight = 0.7;
const advancedInfoHeight = 0.3;
const styles = StyleSheet.create({
  loaderContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" },
  infoScroll: { 
    flex: 1, 
    paddingBottom: 75 
  },
  header: {
    height: height * 0.1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: width * 0.025,
    paddingRight: width * 0.025,
  },
  selectorView: { 
    flexDirection: "row", 
    alignItems: "center" },
  headerText: { fontSize: 24 },
  startingPosModalView:{
    backgroundColor: "white",
    borderRadius: 5,
    width: width * 0.75,
    height: height * 0.4,
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
  },
  startingPosModalHeader: {
    height: height * 0.33 * 0.2,
  },
  startingPosModalImage:{
    width: width * 0.75 * 0.6,
    height: width * 0.75 * 0.6,
  },
  startingPosConfirmButton:{
    position: "absolute",
    bottom: 0,
    width: width * 0.3,
    height: height * 0.33 * 0.2,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    backgroundColor: '#b5d9ffff',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  teamReportInfoView: {
    marginLeft: width * 0.025,
    paddingVertical: height * 0.15 * 0.025,
    paddingLeft: width * 0.55 * 0.025,
    width: width * 0.6,
    height: height * 0.17,
    backgroundColor:"#ffffffff",
    borderRadius: 5,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  matchReportInfoView:{
    marginLeft: width * 0.025,
    paddingVertical: height * 0.13 * 0.05,
    paddingLeft: width * 0.55 * 0.025,
    width: width * 0.95,
    height: height * 0.13,
    backgroundColor:"#ffffffff",
    borderRadius: 5,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  matchReportDetailsScrollView:{
    width: width * 0.95,
    height: height * 0.15 * 0.45,
  },
  privacyView:{
    width: width * 0.35,
    height: height * 0.15 * 0.25,
    borderRadius: 10,
    backgroundColor: "#3d91ffff",
    flexDirection: "row",
  },
  privacyViewGrayed:{
    width: width * 0.35,
    height: height * 0.15 * 0.25,
    borderRadius: 10,
    backgroundColor: "#ffffffff",
    flexDirection: "row",
  },
  privacyViewLeft:{
    fontSize:20,
    width: width * 0.35 * 0.5,
    height: height * 0.15 * 0.25,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },
  privacyViewRight:{
    fontSize: 20,
    backgroundColor: "#ffffffff",
    width: width * 0.35 * 0.5,
    height: height * 0.15 * 0.25,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  privacyViewRightSelected:{
    fontSize: 20,
    backgroundColor: "#3d91ffff",
    width: width * 0.35 * 0.5,
    height: height * 0.15 * 0.25,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  teamNumberView:{
    width: width * 0.45,
    marginRight: width * 0.45 * 0.1,
    height: height * 0.15 * 0.4,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  selfReportButton:{
    width: width * 0.25,
    height: height * 0.15 * 0.25,
    borderRadius: 5,
    backgroundColor: "#ecececff",
    alignItems: "center",
    justifyContent: "center"
  },
  autoRecordView:{
    height: height * 0.175,
    width: width * 0.95,
    borderRadius: 10,
    marginLeft: width * 0.025,
    marginTop: height * 0.0125,
    paddingVertical: height * 0.15 * 0.025,
    paddingLeft: width * 0.55 * 0.025,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#ffffffff"
  },
  headerView:{
    height: height * 0.2 * 0.2,
    width: width * 0.90,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"baseline"
  },
  autoCheckBoxButton:{
    height: height * 0.2 * 0.2,
    width: width * 0.95 * 0.9 *0.4,
    flexDirection: "row", 
    justifyContent: "space-between",
  },
  dataScrollView:{
    width: width * 0.925,
    height: height * 0.2 * 0.4,
  },
  dataView:{
    width: width * 0.95 * 0.3,
    height: height * 0.2 * 0.35,
    marginRight: width * 0.95 * 0.05,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  dataTextInput:{
    fontSize: 16,
  },
  teleopRecordView:{
    height: height * 0.175,
    width: width * 0.95,
    borderRadius: 10,
    marginLeft: width * 0.025,
    marginTop: height * 0.025,
    paddingVertical: height * 0.15 * 0.025,
    paddingLeft: width * 0.55 * 0.025,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#ffffffff"
  },
  teleopHeaderView:{
    height: height * 0.2 * 0.2,
    width: width * 0.90,
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems:"baseline",
  },
  teleopCheckBoxButton:{
    height: height * 0.2 * 0.2,
    width: width * 0.95 * 0.9 *0.425,
    flexDirection: "row", 
    justifyContent: "space-between",
  },

  totalScoreView: {
    height: height * 0.05,
    width: width * 0.40,
    marginTop: height * 0.0125,
    marginLeft: width * 0.025,
    backgroundColor: "#ffffffff",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center"
  },

  teamPositionsView: {
    height: height * 0.275,
    width: width * 0.95,
    marginLeft: width * 0.025,
    marginTop: height * 0.04,
    paddingLeft: width * 0.95 * 0.025,
    paddingVertical: height * 0.4 * 0.025,
    backgroundColor: "#ffffffff",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  teamPositionsHeaderView: {
    height: height * 0.275 * 0.125,
    width: width * 0.95 * 0.4,
    flexDirection: "row",
    alignItems:"baseline",
  },

  teamPositionScrollView: {
    height: height * 0.275 * 0.85,
    width: width * 0.95 * 0.95,
  },

  teamPositionView: {
    height: height * 0.275 * 0.75,
    width: width * 0.95 * 0.95 * 0.4,
    marginRight: width * 0.95 * 0.95 * 0.1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },

  finalteamPositionView: {
    height: height * 0.275 * 0.75,
    width: width * 0.95 * 0.95 * 0.4,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },

  teamPositionViewHeader: {
    height: height * 0.275 * 0.75 * 0.175,
    width: width * 0.95 * 0.95 * 0.4,
    flexDirection: "row",
    justifyContent: "center",
  },

  teamPositionViewMap: {
    width: width * 0.95 * 0.95 * 0.35,
    height: width * 0.95 * 0.95 * 0.35,
    flexDirection: "row",
    justifyContent: "center",
  },

  teamPositionCaption: {
    height: height * 0.275 * 0.75 * 0.15,
    width: width * 0.95 * 0.95 * 0.4,
    flexDirection: "row",
    justifyContent: "center",
  },

  additionalInfo: {
    height: height * 0.175,
    width: width * 0.95,
    marginLeft: width * 0.025,
    marginTop: height * 0.04,
    paddingVertical: height * 0.15 * 0.025,
    paddingLeft: width * 0.55 * 0.025,
    backgroundColor: "#ffffffff",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  additionalInfoHeaderView:{
    width: width * 0.95 * 0.75,
    height: height * 0.175 * 0.2,
  },

  additionalInfoBodyView:{
    width: width * 0.95 ,
    height: height * 0.175 * 0.7,
    textAlign: "left",
  },

  confirmReport:{
    width: width * 0.5,
    height: height * 0.05,
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
    backgroundColor: "#cdf1ffff",
    flexDirection: "row",
    justifyContent: "center",
  },

  container: { flex: 1, backgroundColor: "#F2F2F2" },

});

