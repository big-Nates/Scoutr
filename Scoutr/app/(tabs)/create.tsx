import { Text, TextInput, View, ScrollView, Dimensions, StyleSheet, Pressable, Modal, FlatList, Image, ActivityIndicator, Switch } from "react-native";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import api from "@/app/api/client";
import DataFormRecorder from "@/components/DataFormRecorder";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Double } from "react-native/Libraries/Types/CodegenTypes";
import ProtectedRoute from "@/components/ProtectedRoute";

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
    starting_position: "Close Zone",
    collection_position: "Human Player",
    scoring_position: "Close Zone",
    can_park_two_robots: false,
    additional_info: "",
  };

  interface MatchReportData {
    is_public: boolean;
    season: number;
    classified_amount_auto: number;
    overflow_amount_auto: number;
    motif_amount_auto: number;
    classified_amount_teleop: number;
    motif_amount_teleop: number;
    overflow_amount_teleop: number;
    shots_made_auto: number;
    shots_attempted_auto: number;
    shots_made_teleop: number;
    shots_attempted_teleop: number;
    far_zone_collection_freq: number;
    classifier_collection_freq: number;
    human_player_collection_freq: number;
    close_zone_scoring_freq: number;
    far_zone_scoring_freq: number;
    event_id: string;
    match_number: number;
    tournament_level: string;
    team_number: number;
    additional_info: string;
  }


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
    far_zone_collection_freq: 0,
    classifier_collection_freq: 0,
    human_player_collection_freq: 0,
    close_zone_scoring_freq: 0,
    far_zone_scoring_freq: 0,
    event_id: "",
    match_number: 0,
    tournament_level: "Quals",
    team_number: 0,
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

  const submitMatchReport = async () => {
    if(selectedOption === "Team"){
      try {
        const response = await api.post(`self_reports`, formData);
      } catch (err) {
        console.error("Error fetching user team number:", err);
      } finally {
        setLoading(false);
      }
    }else{
      try {
        setLoading(true);
        const response = await api.post(`match_reports/2025/${matchFormData.event_id}`, matchFormData);
        const reportId = response.data._id;
        const payload = cycles.map(({ id, ...rest }) => rest);
        console.log(payload);
        const cyclesPost = await api.post(`match_reports/${reportId}/cycles/`, payload);
       
      } catch (err) {
        console.error("Error in match report creation:", err);
      } finally {
        setLoading(false);
      }
    }
    
  };


  useEffect(() => {
    fetchUserData();
  }, []);

  const [formData, setFormData] = useState<ReportData>(defaultReportData);
  const [matchFormData, setMatchFormData] = useState<MatchReportData>(defaultMatchReportData);

  const handleNumberInput =
  (field: keyof ReportData, allowDecimal = false, bothForms = true) =>
  (text: string) => {
    let numericText = allowDecimal
      ? text.replace(/[^0-9.]/g, "")
      : text.replace(/[^0-9]/g, "");

    if (allowDecimal) {
      const parts = numericText.split(".");
      if (parts.length > 2)
        numericText = parts[0] + "." + parts.slice(1).join("");
    }
    if(bothForms){
      setMatchFormData(prev => ({
        ...prev,
        [field]: numericText === "" ? 0 : parseFloat(numericText),
      }));
    }
    setFormData(prev => ({
      ...prev,
      [field]: numericText === "" ? 0 : parseFloat(numericText),
    }));
  };

  const handleNumberMatchInput =
  (field: keyof MatchReportData, allowDecimal = false, bothForms = true) =>
  (text: string) => {
    let numericText = allowDecimal
      ? text.replace(/[^0-9.]/g, "")
      : text.replace(/[^0-9]/g, "");

    if (allowDecimal) {
      const parts = numericText.split(".");
      if (parts.length > 2)
        numericText = parts[0] + "." + parts.slice(1).join("");
    }
    setMatchFormData(prev => ({
      ...prev,
      [field]: numericText === "" ? 0 : parseFloat(numericText),
    }));
  };

  const handleFreqInput = (field: keyof MatchReportData, text: number) => {
      setMatchFormData((prev) => ({ ...prev, [field]: text }))
  }

  const handleBooleanChange = (field: keyof ReportData) => (value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setMatchFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const setAscentBonus = () => {
    handleBooleanChange("can_park_two_robots")(!formData.can_park_two_robots); 
    if(!formData.can_park_two_robots){
      setScoreBonus(10);
    }else{
      setScoreBonus(0);
    }
  }

  const [cycles, setCycles] = useState<{
    id: string;
    cycle_time: number;
    collection_position: string;
    scoring_position: string;
    artifacts_collected: number;
    artifacts_scored: number;
  }[]>([
    {
      id: "1",
      collection_position: "Human Player",
      scoring_position: "Far Zone",
      artifacts_collected: 0,
      artifacts_scored: 0,
      cycle_time: 0,
    },
  ]);

  const stats = useMemo(() => {
    return cycles.reduce(
      (acc, cycle) => {
        acc.totalCycles += 1;
        acc.totalCollected += cycle.artifacts_collected;
        acc.totalScored += cycle.artifacts_scored;
        acc.totalTime += cycle.cycle_time;
        if(cycle.collection_position === "Human Player"){
          acc.humanPlayerCollection += 1;
        }else if(cycle.collection_position === "Far Zone"){
          acc.farZoneCollection += 1;
        }else{
          acc.classifierCollection += 1;
        }
        if(cycle.scoring_position == "Close Zone"){
          acc.closeScoring += 1;
        }else{
          acc.farScoring += 1;
        }
        return acc;
      },
      { totalCycles: 0, totalCollected: 0, totalScored: 0, totalTime: 0, humanPlayerCollection: 0, farZoneCollection: 0, classifierCollection: 0, closeScoring: 0, farScoring: 0 }
    );
  }, [cycles]);

  const variance = useMemo(() => {
    if (cycles.length === 0) return 0;

    const mean =
      cycles.reduce((sum, c) => sum + c.cycle_time, 0) / cycles.length;

    const squaredDiffs = cycles.reduce(
      (sum, c) => sum + Math.pow(c.cycle_time - mean, 2),
      0
    );

    return squaredDiffs / cycles.length; // population variance
  }, [cycles]);

  const stdDev = Math.sqrt(variance);

  useEffect(() => {
    handleFreqInput("human_player_collection_freq",stats.humanPlayerCollection);
    handleFreqInput("far_zone_collection_freq",stats.farZoneCollection);
    handleFreqInput("classifier_collection_freq",stats.classifierCollection);
    handleFreqInput("close_zone_scoring_freq",stats.closeScoring);
    handleFreqInput("far_zone_collection_freq",stats.farScoring);

    handleNumberInput("classified_amount_teleop", true)(String(stats.totalScored));
  }, [stats]);

  const avgTime = stats.totalTime / stats.totalCycles || 0;
  const shootingPercentage = (stats.totalScored / stats.totalCollected) * 100 || 0;

  const [currentNumCycles, setNumCycles] = useState(1);

  const addCycle = (initialPos: number) => {
    setCycles(prevCycles => [
      ...prevCycles,
      {
        id: (currentNumCycles+1).toString(), // unique id
        collection_position: "Human Player",
        scoring_position: "Far Zone",
        artifacts_collected: 0,
        artifacts_scored: 0,
        cycle_time: 0
      }
    ]);
    setNumCycles(prev=>prev+1);
  };

  const deleteAndRenumber = (idToDelete: string) => {
    setCycles(prevCycles => {
      // 1. Remove the target item
      const filtered = prevCycles.filter(cycle => cycle.id !== idToDelete);

      // 2. Renumber the IDs of the remaining items
      return filtered.map((cycle, index) => ({
        ...cycle,
        id: (index + 1).toString() // Reset ID based on new array position
      }));
    });

    // 3. Decrement your counter so the next "Add" uses the correct number
    setNumCycles(prev => prev - 1);
  };

  const collectionOptions = ["Human Player", "Far Zone", "Classifier"];
  const scoringOptions = ["Close Zone", "Far Zone"];
  const artCountOptions = [0, 1, 2, 3];

  const [matchType, setMatchType] = useState("Quals");

  const switchMatchType = () => {
    if(matchType === "Quals"){
      setMatchType("DoubleElim");
      setMatchFormData((prev) => ({ ...prev, tournament_level: "DoubleElim" }));
                    
    }else{
      setMatchType("Quals")
      setMatchFormData((prev) => ({ ...prev, tournament_level: "Quals" }));
    }
  }

  const cycleValue = (id: number, field: string, options: string | any[]) => {
    setCycles(prev =>
      prev.map(cycle => {
        if (Number.parseInt(cycle.id) === id) {
          const currentIndex = options.indexOf(cycle[field]);
          const nextIndex = (currentIndex + 1) % options.length;

          return {
            ...cycle,
            [field]: options[nextIndex],
          };
        }
        return cycle;
      })
    );
  };

  const setCycleTime = (id: number, value: Double) => {
    setCycles(prev =>
      prev.map(cycle => {
        if (Number.parseInt(cycle.id) === id) {
          return {
            ...cycle,
            ["cycle_time"]: value,
          };
        }
        return cycle;
      })
    )
  }


  // Dropdown state
  const [selectedOption, setSelectedOption] = useState("Team"); 
  type ActiveModal = "none" | "reportType" | "startingPosMap" | "collectionPosMap" | "scoringPosMap" | "collectionFreqMap" | "scoringFreqMap" | "cycleReport";
  const [activeModal,  setActiveModal] = useState<ActiveModal>("none");
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
    setFormData((prev) => ({
      ...prev,
      ["starting_position"]: startPoses[tempChosenStart],
    }));
    setActiveModal("none");
  }

  const collectionPoses = ['Human Player', 'Far Zone', "Classifier"];
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
    setFormData((prev) => ({
      ...prev,
      ["collection_position"]: collectionPoses[tempChosenCollection],
    }));
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
    setFormData((prev) => ({
      ...prev,
      ["collection_position"]: collectionPoses[tempChosenCollection],
    }));
    setActiveModal("none");
  }

  const openCollectFreqModal = () => {
    setTempClassifierCollectFreq(classifierCollectFreq);
    setTempPlayerCollectFreq(playerCollectFreq);
    setTempFarZoneCollectFreq(farZoneCollectFreq);
    setActiveModal("collectionFreqMap")
  }

  const openScoringFreqModal = () => {
    setTempCloseZoneScoringFreq(closeZoneScoringFreq);
    setTempFarZoneScoringFreq(farZoneScoringFreq);
    setActiveModal("scoringFreqMap")
  }

  const [farZoneCollectFreq, setFarZoneCollectFreq] = useState(0);
  const [tempFarZoneCollectFreq, setTempFarZoneCollectFreq] = useState(0);
  const handleFarZoneCollectFreqChange = (increment: boolean) => {
    if(increment){
      setTempFarZoneCollectFreq(prevCount => prevCount + 1);
    }else if(tempFarZoneCollectFreq > 0){
      setTempFarZoneCollectFreq(prevCount => prevCount - 1);
    }
  }

  const [playerCollectFreq, setPlayerCollectFreq] = useState(0);
  const [tempPlayerCollectFreq, setTempPlayerCollectFreq] = useState(0);
  const handlePlayerCollectFreqChange = (increment: boolean) => {
    if(increment){
      setTempPlayerCollectFreq(prevCount => prevCount + 1);
    }else if(tempPlayerCollectFreq > 0){
      setTempPlayerCollectFreq(prevCount => prevCount - 1);
    }
  }

  const [classifierCollectFreq, setClassifierCollectFreq] = useState(0);
  const [tempClassifierCollectFreq, setTempClassifierCollectFreq] = useState(0);
  const handleClassifierCollectFreqChange = (increment: boolean) => {
    if(increment){
      setTempClassifierCollectFreq(prevCount => prevCount + 1);
    }else if(tempClassifierCollectFreq > 0){
      setTempClassifierCollectFreq(prevCount => prevCount - 1);
    }
  }
  const handleCollectionFreqConfimation = () => {
    handleFreqInput("far_zone_collection_freq",tempFarZoneCollectFreq);
    handleFreqInput("human_player_collection_freq",tempPlayerCollectFreq);
    handleFreqInput("classifier_collection_freq",tempClassifierCollectFreq);
    setActiveModal("none");
  }

  const [farZoneScoringFreq, setFarZoneScoringFreq] = useState(0);
  const [tempFarZoneScoringFreq, setTempFarZoneScoringFreq] = useState(0);
  const handleFarZoneScoringFreqChange = (increment: boolean) => {
    if(increment){
      setTempFarZoneScoringFreq(prevCount => prevCount + 1);
    }else if(tempFarZoneScoringFreq > 0){
      setTempFarZoneScoringFreq(prevCount => prevCount - 1);
    }
  }

  const [closeZoneScoringFreq, setCloseZoneScoringFreq] = useState(0);
  const [tempCloseZoneScoringFreq, setTempCloseZoneScoringFreq] = useState(0);
  const handleCloseZoneScoringFreqChange = (increment: boolean) => {
    if(increment){
      setTempCloseZoneScoringFreq(prevCount => prevCount + 1);
    }else if(tempCloseZoneScoringFreq > 0){
      setTempCloseZoneScoringFreq(prevCount => prevCount - 1);
    }
  }
  const handleScoringFreqConfimation = () => {
    handleFreqInput("far_zone_scoring_freq",tempFarZoneScoringFreq);
    handleFreqInput("close_zone_scoring_freq",tempCloseZoneScoringFreq);
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
    <ProtectedRoute>
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
            {/* Dropdown Modals */}
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
                      Collection Positions
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
                      Scoring Positions
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
            
            <Modal 
              visible={activeModal === "collectionFreqMap"}
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
                <View style={styles.wideModalView}>
                  <View style={styles.collectionModalRowView}>
                    <ScrollView 
                    horizontal={true}
                    >
                      <View style={styles.collectionModalRowEntryView}>
                        <View style={styles.collectionModalImageView}>
                          <Pressable onPress={()=>{handlePlayerCollectFreqChange(false)}}>
                            <MaterialIcons name="remove" size={35}/>
                          </Pressable>
                          <Image source={require("@/assets/images/FTCfield.png")} style={styles.collectionModalImage}/>
                          <Pressable onPress={()=>{handlePlayerCollectFreqChange(true)}}>
                            <MaterialIcons name="add" size={35}/>
                          </Pressable>
                        </View>
                        <Text style={{fontSize: 18}}>
                          Human Player
                        </Text>
                        <Text style={{fontSize: 18}}>
                          {tempPlayerCollectFreq} Times
                        </Text>
                      </View>
                      <View style={styles.collectionModalRowEntryView}>
                        <View style={styles.collectionModalImageView}>
                          <Pressable onPress={()=>{handleFarZoneCollectFreqChange(false)}}>
                            <MaterialIcons name="remove" size={35}/>
                          </Pressable>
                          <Image source={require("@/assets/images/FTCfield.png")} style={styles.collectionModalImage}/>
                          <Pressable onPress={()=>{handleFarZoneCollectFreqChange(true)}}>
                            <MaterialIcons name="add" size={35}/>
                          </Pressable>
                        </View>
                        <Text style={{fontSize: 18}}>
                          Far Zone
                        </Text>
                        <Text style={{fontSize: 18}}>
                          {tempFarZoneCollectFreq} Times
                        </Text>
                      </View>
                      <View style={styles.collectionModalRowEntryView}>
                        <View style={styles.collectionModalImageView}>
                          <Pressable onPress={()=>{handleClassifierCollectFreqChange(false)}}>
                            <MaterialIcons name="remove" size={35}/>
                          </Pressable>
                          <Image source={require("@/assets/images/FTCfield.png")} style={styles.collectionModalImage}/>
                          <Pressable onPress={()=>{handleClassifierCollectFreqChange(true)}}>
                            <MaterialIcons name="add" size={35}/>
                          </Pressable>
                        </View>
                        <Text style={{fontSize: 18}}>
                          Classifier
                        </Text>
                        <Text style={{fontSize: 18}}>
                          {tempClassifierCollectFreq} Times
                        </Text>
                      </View>
                    </ScrollView>
                  </View>
                  
                  <Pressable 
                  style={styles.startingPosConfirmButton}
                  onPress={()=>handleCollectionFreqConfimation()}
                  >
                    <Text style={{fontSize: 20}}>
                      Confirm
                    </Text>
                  </Pressable>               
                </View>
              </Pressable>

            </Modal>

            <Modal 
              visible={activeModal === "scoringFreqMap"}
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
                <View style={styles.wideModalView}>
                  <View style={styles.collectionModalRowView}>
                    <ScrollView 
                    horizontal={true}
                    >
                      <View style={styles.collectionModalRowEntryView}>
                        <View style={styles.collectionModalImageView}>
                          <Pressable onPress={()=>{handleCloseZoneScoringFreqChange(false)}}>
                            <MaterialIcons name="remove" size={35}/>
                          </Pressable>
                          <Image source={require("@/assets/images/FTCfield.png")} style={styles.collectionModalImage}/>
                          <Pressable onPress={()=>{handleCloseZoneScoringFreqChange(true)}}>
                            <MaterialIcons name="add" size={35}/>
                          </Pressable>
                        </View>
                        <Text style={{fontSize: 18}}>
                          Close Zone
                        </Text>
                        <Text style={{fontSize: 18}}>
                          {tempCloseZoneScoringFreq} Times
                        </Text>
                      </View>
                      <View style={styles.collectionModalRowEntryView}>
                        <View style={styles.collectionModalImageView}>
                          <Pressable onPress={()=>{handleFarZoneScoringFreqChange(false)}}>
                            <MaterialIcons name="remove" size={35}/>
                          </Pressable>
                          <Image source={require("@/assets/images/FTCfield.png")} style={styles.collectionModalImage}/>
                          <Pressable onPress={()=>{handleFarZoneScoringFreqChange(true)}}>
                            <MaterialIcons name="add" size={35}/>
                          </Pressable>
                        </View>
                        <Text style={{fontSize: 18}}>
                          Far Zone
                        </Text>
                        <Text style={{fontSize: 18}}>
                          {tempFarZoneScoringFreq} Times
                        </Text>
                      </View>
                      
                    </ScrollView>
                  </View>
                  <Pressable 
                  style={styles.startingPosConfirmButton}
                  onPress={()=>handleScoringFreqConfimation()}
                  >
                    <Text style={{fontSize: 20}}>
                      Confirm
                    </Text>
                  </Pressable>               
                </View>
              </Pressable>
            </Modal>

            <Modal 
              visible={activeModal === "cycleReport"}
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
                <View style={styles.cycleModalView}>
                  <View style={styles.cyclesTableHeaderView}>
                    <Text style={{fontSize: 20}}>
                      Cycle Information
                    </Text>
                  </View>
                  <View style={styles.tableColumnsHeader}>
                    <View style={styles.tableColumnsHeaderEntry}>
                      <Text style={{textAlign: "center"}}>
                        Collect. Area
                      </Text>
                    </View>
                    <View style={styles.tableColumnsHeaderEntry}>
                      <Text style={{textAlign: "center"}}>
                        Shooting Area
                      </Text>
                    </View>
                    <View style={styles.tableColumnsHeaderEntry}>
                      <Text style={{textAlign: "center"}}>
                        Artifacts Collected
                      </Text>
                    </View>
                    <View style={styles.tableColumnsHeaderEntry}>
                      <Text style={{textAlign: "center"}}>
                        Artifacts Scored
                      </Text>
                    </View>
                    <View style={styles.tableColumnsHeaderEntry}>
                      <Text style={{textAlign: "center"}}>
                        Cycle Time
                      </Text>
                    </View>
                    { currentNumCycles === 0 ?
                    (<>
                      <>
                        <Pressable style={{paddingLeft:5}} onPress={()=>{addCycle(0)}}>
                          <MaterialIcons name="add-circle-outline" size={25}/>
                        </Pressable>
                      </>
                    </>):
                    (<>
                    
                    </>)}
                  </View>
                  <View style={styles.cycleRowsView}>
                    <ScrollView>
                      <FlatList
                        data={cycles}
                        keyExtractor={item => item.id}
                        renderItem={({ item }) => (
                          <View style={styles.tableRow}>
                            {/* COLLECTION */}
                            <Pressable style={styles.tableRowEntry} onPress={()=>cycleValue(Number.parseInt(item.id), "collection_position", collectionOptions)}>
                                <Text>{item.collection_position}</Text>
                            </Pressable>

                            {/* SCORING */}
                            <Pressable style={styles.tableRowEntry} onPress={()=>cycleValue(Number.parseInt(item.id), "scoring_position", scoringOptions)}>
                                <Text>{item.scoring_position}</Text>
                            </Pressable>

                            {/* ART COLLECTED */}
                            <Pressable style={styles.tableRowEntry} onPress={()=>cycleValue(Number.parseInt(item.id), "artifacts_collected", artCountOptions)}>
                                <Text>{item.artifacts_collected}</Text>
                            </Pressable>

                            {/* ART SCORED */}
                            <Pressable style={styles.tableRowEntry} onPress={() => cycleValue(Number.parseInt(item.id), "artifacts_scored", artCountOptions)}>
                                <Text>{item.artifacts_scored}</Text>
                            </Pressable>

                            {/* TIME */}
                            <View >
                              <Pressable>
                                <TextInput
                                style={styles.tableRowEntry}
                                value={String(item.cycle_time)}
                                onChangeText={(text) =>
                                  setCycleTime(Number.parseInt(item.id), Number(text))
                                }
                                />
                              </Pressable>
                              
                            </View>
                            {Number.parseInt(item.id) === currentNumCycles ? (<>
                              <Pressable style={{paddingLeft:5}} onPress={()=>{addCycle(Number.parseInt(item.id))}}>
                                <MaterialIcons name="add-circle-outline" size={25}/>
                              </Pressable>
                              <Pressable style={{paddingLeft:5}} onPress={()=>{deleteAndRenumber(item.id)}}>
                                <MaterialIcons name="remove-circle-outline" size={25}/>
                              </Pressable>
                            </>):(<>
                              <Pressable style={{paddingLeft:5}} onPress={()=>{deleteAndRenumber(item.id)}}>
                                  <MaterialIcons name="remove-circle-outline" size={25}/>
                              </Pressable>
                            </>)}
                            
                            
                          </View>
                          
                        )}
                      />
                      
                    </ScrollView>
                  </View>
                  <Pressable 
                  style={styles.startingPosConfirmButton}
                  onPress={() => setActiveModal("none")}
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
                          value={String(matchFormData.event_id || "")}
                          onChangeText={(text) =>
                            setMatchFormData((prev) => ({ ...prev, event_id: text }))
                          }
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
                          keyboardType="numeric"
                          value={String(matchFormData.team_number || "")}
                          onChangeText={handleNumberMatchInput("team_number")}
                        />
                      </View>
                    </View>

                    <View style={styles.teamNumberView}>
                      <Text style={{fontSize: 20}}>
                        Match Number
                      </Text>
                      <View style={{ flexDirection: "row", alignItems: "center"}}>
                        <Pressable onPress={()=>{switchMatchType()}}>
                          <Text style={{paddingRight: width * 0.45 * 0.025, fontSize: 16}}>
                            {matchType}
                          </Text>
                        </Pressable>
                        <MaterialIcons style={{paddingRight: width * 0.45 * 0.1, fontSize: 16}} name="arrow-drop-down" size={16} />
                        <TextInput
                          placeholder="Match #"
                          style={{fontSize:16, width: width *0.45 * 0.4, borderBottomWidth: 1}}
                          keyboardType="numeric"
                          value={String(matchFormData.match_number || "")}
                          onChangeText={handleNumberMatchInput("match_number")}
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
                      onChangeText={handleNumberInput("classified_amount_auto", true)}
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
                      onChangeText={handleNumberInput("overflow_amount_auto", true)}
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
                      onChangeText={handleNumberInput("motif_amount_auto", true)}
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
                      onChangeText={handleNumberInput("classified_amount_teleop", true)}
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
                      onChangeText={handleNumberInput("overflow_amount_teleop", true)}
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
                <View style={styles.advancedMetricsView}>
                  <View style={styles.advancedMetricsHeaderView}>
                    <Text style={{fontSize: 20}}>
                      Advanced Metrics
                    </Text>
                  </View>
                  <View style={styles.advancedMetricsCyclesView}>
                    <View style={styles.advancedMetricsCyclesHeaderView}>
                      <Text style={{fontSize: 18}}>
                        Cycles Info
                      </Text>
                    </View>
                    <View style={styles.advancedMetricsCyclesRowView}>
                      <View style={styles.advancedMetricsCyclesRowDataView}>
                        <Text>
                          Average Cycle
                        </Text>
                        <Text>
                          {avgTime.toFixed(2)} seconds
                        </Text>
                      </View>
                      
                      <View style={styles.advancedMetricsCyclesRowDataView}>
                        <Text>
                          Time Deviation
                        </Text>
                        <Text>
                          {stdDev.toFixed(2)} seconds
                        </Text>
                      </View>
                      <View style={styles.advancedMetricsCyclesRowDataView}>
                        <Text>
                          Shooting %
                        </Text>
                        <Text>
                          {shootingPercentage.toFixed(1)}%
                        </Text>
                      </View>
                      <Pressable onPress={()=>setActiveModal("cycleReport")}>
                        <MaterialIcons name="add-circle-outline" size={30}/>
                      </Pressable>
                    </View>
                  </View>
                  <View style={styles.advancedMetricsFrequencyView}>
                    <View style={styles.advancedMetricsFrequencyHeaderView}>
                      <Text style={{fontSize: 18}}>
                        Frequency Info
                      </Text>
                    </View>
                    <View style={styles.advancedMetricsFrequencyRowView}>
                      <View style={styles.advancedMetricsCollectionFrequencyView}>
                        <Text style={{fontSize: 16}}>
                          Collection Frequency
                        </Text>
                        <View style={styles.advancedMetricsCollectionFrequencyRowView}>
                          <Text>
                            Human Player: {matchFormData.human_player_collection_freq}
                          </Text>
                          <Text>
                            Far Zone: {matchFormData.far_zone_collection_freq}
                          </Text>
                          <Text>
                            Classifier: {matchFormData.classifier_collection_freq}
                          </Text>
                          <Pressable
                            onPress={()=>openCollectFreqModal()}
                            style={styles.advancedMetricsCollectionFrequencyIcon}
                          >
                            <MaterialIcons name="add-circle-outline" size={30} />
                          </Pressable>
                        </View>
                      </View>
                      <View style={styles.advancedMetricsScoringFrequencyView}>
                        <Text>
                          Scoring Frequency
                        </Text>
                        <View style={styles.advancedMetricsCollectionFrequencyRowView}>
                          <Text>
                            Close Zone: {matchFormData.close_zone_scoring_freq}
                          </Text>
                          <Text>
                            Far Zone: {matchFormData.far_zone_scoring_freq}
                          </Text>
                          <Pressable
                            onPress={()=>{openScoringFreqModal()}}
                            style={styles.advancedMetricsScoringFrequencyIcon}
                          >
                            <MaterialIcons name="add-circle-outline" size={30} />
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              </>
            )}
            {selectedOption === "Team"?
            (<>
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
            </>):
            (<>
              <View style={styles.additionalInfo}>
                <View style={styles.additionalInfoHeaderView}>
                  <Text style={{fontSize: 20}}>
                    Additional Information
                  </Text>
                </View>
                <TextInput
                  multiline
                  textAlignVertical="top"
                  placeholder={`Enter additional notes on match #${matchFormData.match_number} for team #${matchFormData.team_number}`}
                  placeholderTextColor="grey"
                  style={styles.additionalInfoBodyView}
                  value={String(formData.additional_info || "")}
                  onChangeText={(text) =>
                        setMatchFormData((prev) => ({ ...prev, additional_info: text }))
                      }
                />
              </View>
            </>)}
            
            
          </View>
          
        </ScrollView>
        <Pressable
          style={styles.confirmReport}
          onPress={()=>{submitMatchReport()}}
        >
          <Text style={{fontSize: 25}}>
            Create Report
          </Text>
        </Pressable>
      </View>  
    </ProtectedRoute>
    
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
  wideModalView:{
    backgroundColor: "white",
    borderRadius: 5,
    width: width * 0.95,
    height: height * 0.35,
    flexDirection: "column",
    alignItems: "center",
    paddingVertical: 10,
  },
  cycleModalView:{
    backgroundColor: "white",
    borderRadius: 5,
    width: width * 0.95,
    height: height * 0.35,
    flexDirection: "column",
    
    paddingVertical: 10,
  },
  collectionModalRowView:{
    width: width * 0.95 * 0.99,
    height: height * 0.4 * 0.65,
    paddingLeft: width * 0.95 * 0.01,
  },
  cycleRowsView:{
    width: width * 0.95 * 0.99,
    height: height * 0.4 * 0.4,
    paddingLeft: width * 0.95 * 0.01,
  },
  cyclesTableHeaderView:{
    width: width * 0.95 * 0.95,
    height: height * 0.35 * 0.125,
    marginLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  tableColumnsHeader:{
    width: width * 0.95 * 0.85,
    height: height * 0.35 * 0.15,
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  tableColumnsHeaderEntry:{
    width: width * 0.95 * 0.8 * 0.2,
    height: height * 0.35 * 0.15,
  },
  tableRow:{
    width: width * 0.95 * 0.9,
    height: height * 0.35 * 0.125,
    flexDirection: "row",
    alignItems: "center",
  },
  tableRowEntry:{
    width: width * 0.95 * 0.8 * 0.2,
    height: height * 0.35 * 0.125,
    alignItems: "center",
    justifyContent: "center",
  },
  collectionModalRowEntryView:{
    width: width * 0.95 * 0.95 * 0.55,
    height: height * 0.4 * 0.625,
    marginLeft: width * 0.95 * 0.95 * 0.025,
    marginRight: width * 0.95 * 0.95 * 0.075,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center"
  },
  collectionModalImageView:{
    width: width * 0.95 * 0.95 * 0.55,
    height: height * 0.4 * 0.75 * 0.65,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white"
  },
  collectionModalImage:{
    width: width * 0.95 * 0.95 * 0.55 * 0.7,
    height: width * 0.95 * 0.95 * 0.55 * 0.7,
  },
  collectionModalFinalRowEntryView:{
    width: width * 0.95 * 0.95 * 0.4,
    height: height * 0.4 * 0.75,
    backgroundColor: "#553d3dff"
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
    alignItems: "center",
    alignSelf: "center"
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


  advancedMetricsView:{
    height: height * 0.25,
    width: width * 0.95,
    borderRadius: 10,
    marginLeft: width * 0.025,
    marginTop: height * 0.025,
    paddingVertical: height * 0.15 * 0.025,
    paddingLeft: width * 0.55 * 0.025,
    flexDirection: "column",
    backgroundColor: "#ffffffff"
  },

  advancedMetricsHeaderView:{
    height: height * 0.25 * 0.125,
    width: width * 0.95 * 0.6,
  },

  advancedMetricsCyclesView:{
    height: height * 0.25 * 0.275,
    width: width * 0.95 * 0.95,
    marginTop: height * 0.25 * 0.0125,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  advancedMetricsCyclesHeaderView:{
    height: height * 0.25 * 0.30 * 0.35,
    width: width * 0.95 * 0.95 * 0.6,
  },

  advancedMetricsCyclesRowView:{
    height: height * 0.25 * 0.30 * 0.5,
    width: width * 0.95 * 0.95,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  advancedMetricsCyclesRowDataView:{
    height: height * 0.25 * 0.30 * 0.5,
    width: width * 0.95 * 0.95 * 0.275,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  advancedMetricsFrequencyView:{
    height: height * 0.25 * 0.45,
    width: width * 0.95 * 0.95,
    marginTop: height * 0.25 * 0.0825,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  advancedMetricsFrequencyHeaderView:{
    height: height * 0.25 * 0.45 * 0.25,
    width: width * 0.95 * 0.95 * 0.5,
  },

  advancedMetricsFrequencyRowView:{
    height: height * 0.25 * 0.45 * 0.8,
    width: width * 0.95 * 0.95,
    flexDirection: "row",
    justifyContent:"space-between"
  },

  advancedMetricsCollectionFrequencyView:{
    height: height * 0.25 * 0.45 * 0.7,
    width: width * 0.95 * 0.95 * 0.45,
    flexDirection: "column",
  },

  advancedMetricsCollectionFrequencyRowView:{
    height: height * 0.25 * 0.45 * 0.7 * 0.85,
    width: width * 0.95 * 0.95 * 0.45,
    flexDirection: "column",
  },

  advancedMetricsScoringFrequencyView:{
    height: height * 0.25 * 0.45 * 0.7,
    width: width * 0.95 * 0.95 * 0.45,
    flexDirection: "column",
  },

  advancedMetricsCollectionFrequencyIcon:{
    position: "absolute",
    bottom: 0,
    right: 0,
  },

  advancedMetricsScoringFrequencyIcon:{
    position: "absolute",
    bottom: 0,
    right: 30,
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

