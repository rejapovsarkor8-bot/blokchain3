// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HospitalQueue {
    address public owner;
    address public specialAllowedAddress; 
    
    uint256 public constant MIN_FEE = 0.01 ether;
    uint256 public constant VIP_FEE = 0.05 ether;
    
    mapping(address => uint256) public balances;
    mapping(address => string) public patientStatus;
    
    event AppointmentBooked(address indexed patient, uint256 amount, string status);
    event FundsWithdrawn(address indexed owner, uint256 amount);
    event FundsTransferred(address indexed from, address indexed to, uint256 amount);

    constructor(address _specialAddress) {
        owner = msg.sender;
        specialAllowedAddress = _specialAddress;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Faqat shifoxona egasi (owner) bu amalni bajara oladi");
        _;
    }

    // Navbatga yozilish funksiyasi (Payable)
    function bookAppointment() public payable {
        // Minimal to'lov miqdorini tekshirish
        require(msg.value >= MIN_FEE, "Minimal to'lov miqdori qondirilmadi (Kamida 0.01 ETH)");

        if (msg.value >= VIP_FEE) {
            patientStatus[msg.sender] = "VIP Navbat";
        } else {
            patientStatus[msg.sender] = "Standard Navbat";
        }

        balances[msg.sender] += msg.value;
        emit AppointmentBooked(msg.sender, msg.value, patientStatus[msg.sender]);
    }

    // Faqat ma'lum bir manzildan kelgan to'lovni qabul qilib, uni boshqa joyga yuborish
    function transferToSpecial(address payable to) public payable {
        // Faqat ma'lum adresdan kelish sharti
        require(msg.sender == specialAllowedAddress, "Ruxsat etilmagan adresdan to'lov keldi");
        require(msg.value > 0, "To'lov miqdori 0 bulmasligi kerak");
        
        to.transfer(msg.value);
        emit FundsTransferred(msg.sender, to, msg.value);
    }

    // Faqat owner uchun pul yechish funksiyasi
    function withdrawFunds() public onlyOwner {
        uint256 contractBalance = address(this).balance;
        require(contractBalance > 0, "Yechish uchun mablag' yo'q");

        payable(owner).transfer(contractBalance);
        emit FundsWithdrawn(owner, contractBalance);
    }

    // Foydalanuvchining shifoxonadagi statusi va to'lagan pulini ko'rish
    function getPatientInfo(address patient) public view returns (string memory, uint256) {
        return (patientStatus[patient], balances[patient]);
    }
}
