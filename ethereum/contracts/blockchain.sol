pragma experimental ABIEncoderV2;

contract Mapping {
    address addressMappingAddress;
    address doctorAddress;
    
    function setAddressMappingAddress(address add) public returns(bool) {
        addressMappingAddress = add;
    }
    
    function getAddressMappingAddress() public view returns(address) {
        return(addressMappingAddress);
    }

    function setDoctorAddress(address add) public returns(bool) {
        doctorAddress = add;
    }
    
    function getDoctorAddress() public view returns(address) {
        return(doctorAddress);
    }
}

contract Doctor {
    struct doctor {
        int aadhar;
        string name;
        string details;
    }
    mapping(address => doctor) public map;
    mapping(address => bool) public check;
    mapping(int => address) public getAddress;

    function isDoctor(address add) public view returns (bool) {
        if(check[add])
            return true;
        return false;
    }

    function addDoctor(int aadharr, string memory namee, string memory detailss) public {
        if(!check[msg.sender]) {
            doctor memory doc = doctor({
                aadhar: aadharr,
                name: namee,
                details: detailss
            });
            check[msg.sender] = true;
            map[msg.sender] = doc;
            getAddress[aadharr] = msg.sender;
        }
    }
    
    function getDoctorAddress(int aadhar) public view returns(address) {
        return (getAddress[aadhar]);
    }

    function createMedicalRecord(string memory namee, string memory genderr, string memory dobb, string memory mobilee, int aadharr, string memory paddresss, 
    string memory postalcodee, string memory countryy, string memory passwordd, string memory filePassword) public {
        if(check[msg.sender]) {
            AddressMapping am = AddressMapping(0xc821543770F3256f9f78354D6193777dA338f6D1);
            address returnAdd = address(new MedicalRecord(namee, genderr, dobb, mobilee, aadharr, paddresss, postalcodee, countryy, passwordd, filePassword, address(msg.sender)));
            am.setRecordAddress(aadharr, returnAdd);
        }
    }
}

contract MedicalRecord {
    event ChangeOccured();
    event LogBook(string logHeader, string logDetails);
    struct PatientDemographics {
        string name;
        string gender;
        string dob;
        string mobile;
        int aadhar;
        string paddress;
        string postalcode;
        string country;
    }
    
    struct PatientNonDemographics {
        string medicalHistory;
        string diagnosis;
        string medications;
        string allergies;
        string progressNotes;
        string vitalSigns;
        string immunizationDates;
        string emergency;   
    }
    
    struct Files {
        string[] billingData;
        string[] radiologyImages;
        string[] labResults;
        string[] insurance;
    }
    
    PatientDemographics patientDemographics;
    PatientNonDemographics patientNonDemographics;
    Files files;

    mapping(address => bool) doctorsAllowed;
    
    string password;
    string filePassword;

    constructor(string memory namee, string memory genderr, string memory dobb, string memory mobilee, int aadharr, string memory paddresss, 
    string memory postalcodee, string memory countryy, string memory passwordd, string memory filePass, address doctorsAddress) public {
        
        PatientDemographics memory pat = PatientDemographics( { 
            name: namee,
            gender: genderr,
            dob: dobb,
            mobile: mobilee,
            aadhar: aadharr,
            paddress: paddresss,
            postalcode: postalcodee,
            country: countryy
        });
        
        patientDemographics = pat;
        password = passwordd;
        filePassword = filePass;
        doctorsAllowed[doctorsAddress] = true;
    }
    
    function getFilePassword() public view returns(string memory) {
        if(isDoctorAllowed(msg.sender)) {
            return filePassword;
        }
    }
    
    function getFilePasswordPassword(string memory password) public view returns(string memory) {
        if(isCorrectPassword(password)) {
            return filePassword;
        }
    }
    
    function addFiles(string memory billingDataa, string memory radiologyImagess, string memory labResultss, string memory logHeader, string memory logDetails) public {
        if(isDoctorAllowed(msg.sender)) {
            if(!(keccak256(abi.encodePacked(billingDataa)) == keccak256(abi.encodePacked("")))) {
                files.billingData.push(billingDataa);
            }
            if(!(keccak256(abi.encodePacked(radiologyImagess)) == keccak256(abi.encodePacked("")))) {
                files.radiologyImages.push(radiologyImagess);
            }
            if(!(keccak256(abi.encodePacked(labResultss)) == keccak256(abi.encodePacked("")))) {
                files.labResults.push(labResultss);
            }
            emit ChangeOccured();
            emit LogBook(logHeader,logDetails);
        }
    }
    
    function updateNondemographics(string memory medicalHistoryy, string memory diagnosiss, string memory medicationss,
    string memory allergiess, string memory progressNotess, string memory vitalSignss, string memory immunizationDatess, 
    string memory emergencyy, string memory logHeader, string memory logDetails) public {
        if(isDoctorAllowed(msg.sender)) {
            PatientNonDemographics memory pat = PatientNonDemographics( { 
                medicalHistory: medicalHistoryy,
                diagnosis: diagnosiss,
                medications: medicationss,
                allergies: allergiess,
                progressNotes: progressNotess,
                vitalSigns: vitalSignss,
                immunizationDates: immunizationDatess,
                emergency: emergencyy
            });
            patientNonDemographics = pat;
            emit ChangeOccured();
            emit LogBook(logHeader,logDetails);
        }
    }
    
    function isDoctorAllowed(address add) public view returns(bool) {
        Mapping mp = Mapping(0x034E524e35a165c5d829b2985EAdDe75562Ed15C);
        Doctor dc = Doctor(mp.getDoctorAddress());
        if(dc.isDoctor(add)) {
            if(doctorsAllowed[add] == true) {
                return true;
            }else {
                return false;
            }
        }else {
            return false;
        }
    }
    
    function isCorrectPassword(string memory pass) public view returns(bool) {
        if(keccak256(abi.encodePacked(pass)) == keccak256(abi.encodePacked(password))) {
            return true;
        }else {
            return false;
        }
    }
    
    function addDoctor(address doc, string memory pass, string memory logHeader, string memory logDetails) public {
        if(keccak256(abi.encodePacked(pass)) == keccak256(abi.encodePacked(password))) {
            doctorsAllowed[doc] = true;
            emit LogBook(logHeader,logDetails);
        }
    }
    
    function getEmergencyData() public view returns(string memory) {
        return patientNonDemographics.emergency;
    }
    
    function addInsurance(string memory insurancee, string memory pass, string memory logHeader, string memory logDetails) public {
        if(keccak256(abi.encodePacked(pass)) == keccak256(abi.encodePacked(password))) {
            files.insurance.push(insurancee);
            emit ChangeOccured();
            emit LogBook(logHeader,logDetails);
        }
    }
    
    function getPatientDataPassword(string memory passworddd) public view returns(bool, PatientDemographics memory, PatientNonDemographics memory, Files memory) {
        if(isCorrectPassword(passworddd)) {
            return( true, patientDemographics, patientNonDemographics, files );
        }
        else {
            PatientDemographics memory dummy = PatientDemographics({
                name: 'xxx',
                gender : 'xxx',
                dob: 'xxx',
                mobile: 'xxx',
                aadhar: 999,
                paddress: 'xxx',
                postalcode: 'xxx',
                country: 'xxx'
            });
            PatientNonDemographics memory dum = PatientNonDemographics({
                medicalHistory: 'xxx',
                diagnosis: 'xxx',
                medications: 'xxx',
                allergies: 'xxx',
                progressNotes: 'xxx',
                vitalSigns: 'xxx',
                immunizationDates: 'xxx',
                emergency: 'xxx'
            });
            Files memory dumFiles = Files({
                billingData: new string[](1),
                radiologyImages: new string[](1),
                labResults: new string[](1),
                insurance: new string[](1)
            });
            return(false, dummy, dum, dumFiles);
        }
    }
    
    function getPatientData() public view returns(bool, PatientDemographics memory, PatientNonDemographics memory, Files memory) {
        if(isDoctorAllowed(msg.sender)) {
            return( true, patientDemographics, patientNonDemographics, files );
        }
        else {
            PatientDemographics memory dummy = PatientDemographics({
                name: 'xxx',
                gender : 'xxx',
                dob: 'xxx',
                mobile: 'xxx',
                aadhar: 999,
                paddress: 'xxx',
                postalcode: 'xxx',
                country: 'xxx'
            });
            PatientNonDemographics memory dum = PatientNonDemographics({
                medicalHistory: 'xxx',
                diagnosis: 'xxx',
                medications: 'xxx',
                allergies: 'xxx',
                progressNotes: 'xxx',
                vitalSigns: 'xxx',
                immunizationDates: 'xxx',
                emergency: 'xxx'
            });
            Files memory dumFiles = Files({
                billingData: new string[](1),
                radiologyImages: new string[](1),
                labResults: new string[](1),
                insurance: new string[](1)
            });
            return(false, dummy, dum, dumFiles);
        }
    }
}

contract AddressMapping {
    mapping(int => address) mapRecord;
    mapping(int => address) mapInsurance;
    mapping(address => address) ownerMap;
    mapping(address => bool) ownerMapCheck;
    mapping(int => int) insuranceNumber;

    function getRecordAddress(int aadhar) public view returns(address) {
        return mapRecord[aadhar];
    }
    
    function getInsuranceNumberCount(int aadhar) public view returns(int) {
        return insuranceNumber[aadhar];
    }

    function setRecordAddress(int aadhar, address patient) public {
        mapRecord[aadhar] = patient;
    }
    
    function getInsuranceAddress(int insNum) public view returns(address) {
        return mapInsurance[insNum];
    }

    function setInsuranceAddress(int insNum, address insurance, int aadhar, int count) public {
        mapInsurance[insNum] = insurance;
        insuranceNumber[aadhar] = count;
    }
    
    function createOwner(string memory pass) public {
        if(!ownerMapCheck[msg.sender]) {
            address add = address(new Owner(pass, msg.sender));
            ownerMap[msg.sender] = add;
            ownerMapCheck[msg.sender] = true;
        }
    }
    
    function getOwnerAddress() public view returns(address) {
        return ownerMap[msg.sender];
    }
}

contract Owner {
    event ChangeOccured();
    struct Request {
        address ownerAdd;
        address selfAdd;
        string title;
        string details;
        bool doctor;
        bool owner;
        string bills;
        uint256 index;
        uint256 pendingRequestsIndex;
        int aadhar;
        string documents;
        bool finalize;
    }
    
    string password;
    address manager;
    Request[] requests;
    address[] insuranceIssued;
    mapping(address => bool) isIssuedInsurance;
    
    constructor(string memory pass, address add) public {
        manager = add;
        password = pass;
    }

    function isCorrectPassword(string memory pass) public view returns(bool) {
        if(keccak256(abi.encodePacked(pass)) == keccak256(abi.encodePacked(password))) {
            return true;
        }else {
            return false;
        }
    }

    function getData(string memory pass) public view returns(bool, address[] memory, Request[] memory, address) {
        if((msg.sender == manager) && (isCorrectPassword(pass))) {
            return( true, insuranceIssued, requests, address(this) );
        }
        else {
            address[] memory dummy = new address[](1);
            Request[] memory dummyRequests = new Request[](1);

            return ( false, dummy, dummyRequests, 0x0000000000000000000000000000000000000000);
        }
    }

    function createInsurance(string memory name, int aadhar, int amount, string memory insDetailss, string memory documentss, int setInsuranceAddresss, int count) public  {
        if( msg.sender == manager ) {
            address newInsurance = address(new Insurance(address(this), name, aadhar, amount, insDetailss, documentss));
            insuranceIssued.push(newInsurance);
            isIssuedInsurance[newInsurance] = true;
            Mapping mp = Mapping(0x034E524e35a165c5d829b2985EAdDe75562Ed15C);
            AddressMapping hh = AddressMapping(mp.getAddressMappingAddress());
            hh.setInsuranceAddress(setInsuranceAddresss, newInsurance, aadhar, count);
            emit ChangeOccured();
        }
    }

    function pendingRequest(address ownerAddd, address selfAddd, string memory titlee, string memory detailss, string memory fileHash, bool doctorr, bool ownerrrr, uint256 index, int aad, string memory doc) public {
        if(isIssuedInsurance[selfAddd]) {
            Request memory newRequest = Request ( {
                ownerAdd: ownerAddd,
                selfAdd: selfAddd,
                title: titlee,
                details: detailss,
                bills: fileHash,
                doctor: doctorr,
                owner: ownerrrr,
                index: index,
                pendingRequestsIndex: requests.length,
                aadhar: aad,
                documents: doc,
                finalize: false
            });
            requests.push(newRequest);
            emit ChangeOccured();
        }
    }

    function approveCancelRequest(uint256 index, bool flag) public {
        if(msg.sender == manager) {
            if(flag == true) {
                Insurance inu = Insurance(address(requests[index].selfAdd));
                inu.finalizeRequest(requests[index].index, address(this), true);
                requests[index].owner = true;
                requests[index].finalize = true;
                emit ChangeOccured();
            }
            else {
                Insurance inu = Insurance(address(requests[index].selfAdd));
                inu.finalizeRequest(requests[index].index, address(this), false);
                requests[index].owner = false;
                requests[index].finalize = true;
                emit ChangeOccured();
                
            }
        }
    }


}

contract Insurance {
    event ChangeOccured();
    struct Request {
        address ownerAdd;
        address selfAdd;
        string title;
        string details;
        bool doctor;
        bool owner;
        string bills;
        uint256 index;
        bool finalize;
        uint256 pendingRequestsIndex;
    }

    address selfAddress;
    address ownerr;
    string name;
    int aadhar;
    string insDetails;
    string documents;
    int amount;
    int requestsCount = -1;
    Request[] requests;

    constructor(address ownerrr, string memory namee, int aadharr, int amountt, string memory insDetailss, string memory documentss) public {
        selfAddress = address(this);
        ownerr = ownerrr;
        name = namee;
        insDetails = insDetailss;
        documents = documentss;
        aadhar = aadharr;
        amount = amountt;
    }
    
    function getData() public view returns(address, address, string memory, int, string memory, string memory, int, Request[] memory) {
        return(selfAddress, ownerr, name, aadhar, insDetails, documents, amount, requests);
    }

    function applyClaim(string memory fileHash, string memory titlee, string memory detailss) public {
        Request memory newRequest = Request( {
            ownerAdd: ownerr,
            selfAdd: address(this),
            title: titlee,
            details: detailss,
            bills: fileHash,
            doctor: true,
            owner: false,
            index: uint256(requestsCount + 1),
            finalize: false,
            pendingRequestsIndex: 0
        });
        requests.push(newRequest);
        Owner oo = Owner(ownerr);
        oo.pendingRequest(ownerr, address(this), titlee, detailss, fileHash, true, false, uint256(requestsCount + 1), aadhar, documents);
        requestsCount = requestsCount + 1;
        emit ChangeOccured();
    }

    function finalizeRequest(uint256 index, address add, bool flag) public {
        if(add == ownerr) {
            if(flag == true) {
                requests[index].finalize = true;
                requests[index].owner = true;
            }
            else {
                requests[index].finalize = true;
                requests[index].owner = false;
            }
            emit ChangeOccured();
        }
    }
}