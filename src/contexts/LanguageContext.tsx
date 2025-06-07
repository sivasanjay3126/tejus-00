
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ta' | 'te' | 'kn' | 'ml' | 'hi' | 'tcy';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

const translations = {
  en: {
    // Header
    'app.title': 'TEJUS',
    'app.subtitle': 'Emergency Alert System',
    
    // Main page
    'main.title': 'Emergency Response System',
    'main.subtitle': 'Quick access to emergency services across Tamil Nadu',
    'main.snapToSave': 'Snap to Save',
    'main.goToSave': 'Go to Save',
    'main.smsToSave': 'SMS to Save',
    
    // Emergency contacts
    'contacts.title': 'Emergency Contacts',
    'contacts.ambulance': 'Ambulance',
    'contacts.police': 'Police',
    'contacts.fire': 'Fire Service',
    'contacts.disaster': 'Emergency Disaster',
    'contacts.women': 'Women Helpline',
    
    // About section
    'about.title': 'About Tamil Nadu Medical Services',
    'about.description': 'Tamil Nadu has comprehensive government and private hospitals equipped with emergency services across all districts. The TEJUS app helps you locate and connect with the nearest medical facilities quickly during emergencies.',
    
    // Footer
    'footer.title': 'TEJUS Emergency Alert System',
    'footer.copyright': '© 2025 All rights reserved',
    
    // Nearby facilities
    'nearby.title': 'TEJUS - Medical Help Across Tamil Nadu',
    'nearby.showing': 'Showing medical facilities across Tamil Nadu',
    'nearby.hospitals': 'Hospitals',
    'nearby.shops': 'Shops',
    'nearby.tents': 'Tents',
    'nearby.ambulance': 'Ambulance',
    'nearby.call': 'Call',
    'nearby.directions': 'Directions',
    'nearby.noFacilities': 'found nearby',
    
    // SMS Capture
    'sms.title': 'TEJUS - SMS Emergency',
    'sms.offline': 'Offline Mode - Auto SMS Ready',
    'sms.location': 'Location:',
    'sms.willSend': 'SMS will be sent to: +91 9092023126 (Offline Mode)',
    'sms.preparing': 'Preparing camera...',
  },
  ta: {
    // Header
    'app.title': 'டெஜஸ்',
    'app.subtitle': 'அவசர எச்சரிக்கை அமைப்பு',
    
    // Main page
    'main.title': 'அவசர மறுமொழி அமைப்பு',
    'main.subtitle': 'தமிழ்நாடு முழுவதும் அவசர சேவைகளுக்கு விரைவான அணுகல்',
    'main.snapToSave': 'படம் எடுத்து காப்பாற்று',
    'main.goToSave': 'சென்று காப்பாற்று',
    'main.smsToSave': 'எஸ்எம்எஸ் காப்பாற்று',
    
    // Emergency contacts
    'contacts.title': 'அவசர தொடர்புகள்',
    'contacts.ambulance': 'ஆம்புலன்ஸ்',
    'contacts.police': 'காவல்துறை',
    'contacts.fire': 'தீயணைப்பு சேவை',
    'contacts.disaster': 'அவசர பேரிடர்',
    'contacts.women': 'பெண்கள் உதவி',
    
    // About section
    'about.title': 'தமிழ்நாடு மருத்துவ சேவைகள் பற்றி',
    'about.description': 'தமிழ்நாட்டில் அனைத்து மாவட்டங்களிலும் அவசர சேவைகளுடன் கூடிய விரிவான அரசு மற்றும் தனியார் மருத்துவமனைகள் உள்ளன. டெஜஸ் பயன்பாடு அவசரகாலத்தில் அருகிலுள்ள மருத்துவ வசதிகளை விரைவாக கண்டறிந்து இணைக்க உதவுகிறது.',
    
    // Footer
    'footer.title': 'டெஜஸ் அவசர எச்சரிக்கை அமைப்பு',
    'footer.copyright': '© 2025 அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை',
    
    // Nearby facilities
    'nearby.title': 'டெஜஸ் - தமிழ்நாடு முழுவதும் மருத்துவ உதவி',
    'nearby.showing': 'தமிழ்நாடு முழுவதும் மருத்துவ வசதிகளைக் காட்டுகிறது',
    'nearby.hospitals': 'மருத்துவமனைகள்',
    'nearby.shops': 'கடைகள்',
    'nearby.tents': 'கூடாரங்கள்',
    'nearby.ambulance': 'ஆம்புலன்ஸ்',
    'nearby.call': 'அழைக்கவும்',
    'nearby.directions': 'திசைகள்',
    'nearby.noFacilities': 'அருகில் கிடைக்கவில்லை',
    
    // SMS Capture
    'sms.title': 'டெஜஸ் - எஸ்எம்எஸ் அவசரம்',
    'sms.offline': 'ஆஃப்லைன் முறை - தானியங்கி எஸ்எம்எஸ் தயார்',
    'sms.location': 'இடம்:',
    'sms.willSend': 'எஸ்எம்எஸ் அனுப்பப்படும்: +91 9092023126 (ஆஃப்லைன் முறை)',
    'sms.preparing': 'கேமரா தயாராகிறது...',
  },
  te: {
    // Header
    'app.title': 'టెజస్',
    'app.subtitle': 'అత్యవసర హెచ్చరిక వ్యవస్థ',
    
    // Main page
    'main.title': 'అత్యవసర ప్రతిస్పందన వ్యవస్థ',
    'main.subtitle': 'తమిళనాడు అంతటా అత్యవసర సేవలకు త్వరిత ప్రవేశం',
    'main.snapToSave': 'స్నాప్ టు సేవ్',
    'main.goToSave': 'గో టు సేవ్',
    'main.smsToSave': 'SMS టు సేవ్',
    
    // Emergency contacts
    'contacts.title': 'అత్యవసర పరిచయాలు',
    'contacts.ambulance': 'అంబులెన్స్',
    'contacts.police': 'పోలీసులు',
    'contacts.fire': 'అగ్నిమాపక సేవ',
    'contacts.disaster': 'అత్యవసర విపత్తు',
    'contacts.women': 'మహిళా హెల్ప్‌లైన్',
    
    // About section
    'about.title': 'తమిళనాడు వైద్య సేవల గురించి',
    'about.description': 'తమిళనాడులో అన్ని జిల్లాలలో అత్యవసర సేవలతో కూడిన సమగ్ర ప్రభుత్వ మరియు ప్రైవేట్ ఆసుపత్రులు ఉన్నాయి. టెజస్ యాప్ అత్యవసర సమయాలలో సమీపంలోని వైద్య సౌకర్యాలను త్వరగా గుర్తించి కనెక్ట్ చేయడంలో సహాయపడుతుంది.',
    
    // Footer
    'footer.title': 'టెజస్ అత్యవసర హెచ్చరిక వ్యవస్థ',
    'footer.copyright': '© 2025 అన్ని హక్కులు రక్షించబడ్డాయి',
    
    // Nearby facilities
    'nearby.title': 'టెజస్ - తమిళనాడు అంతటా వైద్య సహాయం',
    'nearby.showing': 'తమిళనాడు అంతటా వైద్య సౌకర్యాలను చూపిస్తోంది',
    'nearby.hospitals': 'ఆసుపత్రులు',
    'nearby.shops': 'దుకాణాలు',
    'nearby.tents': 'గుడారాలు',
    'nearby.ambulance': 'అంబులెన్స్',
    'nearby.call': 'కాల్',
    'nearby.directions': 'దిశలు',
    'nearby.noFacilities': 'దగ్గరలో దొరకలేదు',
    
    // SMS Capture
    'sms.title': 'టెజస్ - SMS అత్యవసరం',
    'sms.offline': 'ఆఫ్‌లైన్ మోడ్ - ఆటో SMS రెడీ',
    'sms.location': 'స్థానం:',
    'sms.willSend': 'SMS పంపబడుతుంది: +91 9092023126 (ఆఫ్‌లైన్ మోడ్)',
    'sms.preparing': 'కెమెరా సిద్ధం చేస్తోంది...',
  },
  kn: {
    // Header
    'app.title': 'ತೇಜಸ್',
    'app.subtitle': 'ತುರ್ತು ಎಚ್ಚರಿಕೆ ವ್ಯವಸ್ಥೆ',
    
    // Main page
    'main.title': 'ತುರ್ತು ಪ್ರತಿಕ್ರಿಯೆ ವ್ಯವಸ್ಥೆ',
    'main.subtitle': 'ತಮಿಳುನಾಡಿನಾದ್ಯಂತ ತುರ್ತು ಸೇವೆಗಳಿಗೆ ತ್ವರಿತ ಪ್ರವೇಶ',
    'main.snapToSave': 'ಸ್ನ್ಯಾಪ್ ಟು ಸೇವ್',
    'main.goToSave': 'ಗೋ ಟು ಸೇವ್',
    'main.smsToSave': 'SMS ಟು ಸೇವ್',
    
    // Emergency contacts
    'contacts.title': 'ತುರ್ತು ಸಂಪರ್ಕಗಳು',
    'contacts.ambulance': 'ಆಂಬುಲೆನ್ಸ್',
    'contacts.police': 'ಪೊಲೀಸ್',
    'contacts.fire': 'ಅಗ್ನಿಶಾಮಕ ಸೇವೆ',
    'contacts.disaster': 'ತುರ್ತು ವಿಪತ್ತು',
    'contacts.women': 'ಮಹಿಳಾ ಸಹಾಯವಾಣಿ',
    
    // About section
    'about.title': 'ತಮಿಳುನಾಡು ವೈದ್ಯಕೀಯ ಸೇವೆಗಳ ಬಗ್ಗೆ',
    'about.description': 'ತಮಿಳುನಾಡಿನಲ್ಲಿ ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ತುರ್ತು ಸೇವೆಗಳೊಂದಿಗೆ ವ್ಯಾಪಕವಾದ ಸರ್ಕಾರಿ ಮತ್ತು ಖಾಸಗಿ ಆಸ್ಪತ್ರೆಗಳಿವೆ. ತೇಜಸ್ ಅಪ್ಲಿಕೇಶನ್ ತುರ್ತು ಸಂದರ್ಭಗಳಲ್ಲಿ ಹತ್ತಿರದ ವೈದ್ಯಕೀಯ ಸೌಲಭ್ಯಗಳನ್ನು ತ್ವರಿತವಾಗಿ ಗುರುತಿಸಲು ಮತ್ತು ಸಂಪರ್ಕಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ.',
    
    // Footer
    'footer.title': 'ತೇಜಸ್ ತುರ್ತು ಎಚ್ಚರಿಕೆ ವ್ಯವಸ್ಥೆ',
    'footer.copyright': '© 2025 ಎಲ್ಲಾ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ',
    
    // Nearby facilities
    'nearby.title': 'ತೇಜಸ್ - ತಮಿಳುನಾಡಿನಾದ್ಯಂತ ವೈದ್ಯಕೀಯ ಸಹಾಯ',
    'nearby.showing': 'ತಮಿಳುನಾಡಿನಾದ್ಯಂತ ವೈದ್ಯಕೀಯ ಸೌಲಭ್ಯಗಳನ್ನು ತೋರಿಸುತ್ತಿದೆ',
    'nearby.hospitals': 'ಆಸ್ಪತ್ರೆಗಳು',
    'nearby.shops': 'ಅಂಗಡಿಗಳು',
    'nearby.tents': 'ಗುಡಾರಗಳು',
    'nearby.ambulance': 'ಆಂಬುಲೆನ್ಸ್',
    'nearby.call': 'ಕರೆ',
    'nearby.directions': 'ದಿಕ್ಕುಗಳು',
    'nearby.noFacilities': 'ಹತ್ತಿರದಲ್ಲಿ ಸಿಗಲಿಲ್ಲ',
    
    // SMS Capture
    'sms.title': 'ತೇಜಸ್ - SMS ತುರ್ತು',
    'sms.offline': 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ - ಆಟೋ SMS ಸಿದ್ಧ',
    'sms.location': 'ಸ್ಥಳ:',
    'sms.willSend': 'SMS ಕಳುಹಿಸಲಾಗುವುದು: +91 9092023126 (ಆಫ್‌ಲೈನ್ ಮೋಡ್)',
    'sms.preparing': 'ಕ್ಯಾಮೆರಾ ಸಿದ್ಧಪಡಿಸುತ್ತಿದೆ...',
  },
  ml: {
    // Header
    'app.title': 'തേജസ്',
    'app.subtitle': 'അടിയന്തിര മുന്നറിയിപ്പ് സംവിധാനം',
    
    // Main page
    'main.title': 'അടിയന്തിര പ്രതികരണ സംവിധാനം',
    'main.subtitle': 'തമിഴ്നാട് മുഴുവൻ അടിയന്തിര സേവനങ്ങളിലേക്കുള്ള വേഗത്തിലുള്ള പ്രവേശനം',
    'main.snapToSave': 'സ്‌നാപ്പ് ടു സേവ്',
    'main.goToSave': 'ഗോ ടു സേവ്',
    'main.smsToSave': 'SMS ടു സേവ്',
    
    // Emergency contacts
    'contacts.title': 'അടിയന്തിര ബന്ധങ്ങൾ',
    'contacts.ambulance': 'ആംബുലൻസ്',
    'contacts.police': 'പോലീസ്',
    'contacts.fire': 'അഗ്നിശമന സേവനം',
    'contacts.disaster': 'അടിയന്തിര ദുരന്തം',
    'contacts.women': 'വനിതാ സഹായ വാര്‍‌',
    
    // About section
    'about.title': 'തമിഴ്നാട് മെഡിക്കൽ സേവനങ്ങളെക്കുറിച്ച്',
    'about.description': 'തമിഴ്നാട്ടിൽ എല്ലാ ജില്ലകളിലും അടിയന്തിര സേവനങ്ങളുള്ള സമഗ്രമായ സർക്കാർ, സ്വകാര്യ ആശുപത്രികൾ ഉണ്ട്. തേജസ് ആപ്പ് അടിയന്തിരാവസ്ഥയിൽ അടുത്തുള്ള മെഡിക്കൽ സൗകര്യങ്ങൾ വേഗത്തിൽ കണ്ടെത്താനും ബന്ധപ്പെടാനും സഹായിക്കുന്നു.',
    
    // Footer
    'footer.title': 'തേജസ് അടിയന്തിര മുന്നറിയിപ്പ് സംവിധാനം',
    'footer.copyright': '© 2025 എല്ലാ അവകാശങ്ങളും സംരക്ഷിച്ചിരിക്കുന്നു',
    
    // Nearby facilities
    'nearby.title': 'തേജസ് - തമിഴ്നാട് മുഴുവൻ മെഡിക്കൽ സഹായം',
    'nearby.showing': 'തമിഴ്നാട് മുഴുവൻ മെഡിക്കൽ സൗകര്യങ്ങൾ കാണിക്കുന്നു',
    'nearby.hospitals': 'ആശുപത്രികൾ',
    'nearby.shops': 'കടകൾ',
    'nearby.tents': 'കൂടാരങ്ങൾ',
    'nearby.ambulance': 'ആംബുലൻസ്',
    'nearby.call': 'വിളിക്കുക',
    'nearby.directions': 'ദിശകൾ',
    'nearby.noFacilities': 'അടുത്ത് കണ്ടെത്തിയില്ല',
    
    // SMS Capture
    'sms.title': 'തേജസ് - SMS അടിയന്തിരം',
    'sms.offline': 'ഓഫ്‌ലൈൻ മോഡ് - ഓട്ടോ SMS റെഡി',
    'sms.location': 'സ്ഥാനം:',
    'sms.willSend': 'SMS അയയ്ക്കപ്പെടും: +91 9092023126 (ഓഫ്‌ലൈൻ മോഡ്)',
    'sms.preparing': 'ക്യാമറ തയ്യാറാക്കുന്നു...',
  },
  hi: {
    // Header
    'app.title': 'तेजस',
    'app.subtitle': 'आपातकालीन अलर्ट सिस्टम',
    
    // Main page
    'main.title': 'आपातकालीन प्रतिक्रिया सिस्टम',
    'main.subtitle': 'तमिलनाडु भर में आपातकालीन सेवाओं तक त्वरित पहुंच',
    'main.snapToSave': 'स्नैप टु सेव',
    'main.goToSave': 'गो टु सेव',
    'main.smsToSave': 'SMS टु सेव',
    
    // Emergency contacts
    'contacts.title': 'आपातकालीन संपर्क',
    'contacts.ambulance': 'एम्बुलेंस',
    'contacts.police': 'पुलिस',
    'contacts.fire': 'अग्निशमन सेवा',
    'contacts.disaster': 'आपातकालीन आपदा',
    'contacts.women': 'महिला हेल्पलाइन',
    
    // About section
    'about.title': 'तमिलनाडु चिकित्सा सेवाओं के बारे में',
    'about.description': 'तमिलनाडु में सभी जिलों में आपातकालीन सेवाओं से सुसज्जित व्यापक सरकारी और निजी अस्पताल हैं। तेजस ऐप आपातकाल में निकटतम चिकित्सा सुविधाओं का पता लगाने और जल्दी जुड़ने में मदद करता है।',
    
    // Footer
    'footer.title': 'तेजस आपातकालीन अलर्ट सिस्टम',
    'footer.copyright': '© 2025 सभी अधिकार सुरक्षित',
    
    // Nearby facilities
    'nearby.title': 'तेजस - तमिलनाडु भर में चिकित्सा सहायता',
    'nearby.showing': 'तमिलनाडु भर में चिकित्सा सुविधाएं दिखा रहा है',
    'nearby.hospitals': 'अस्पताल',
    'nearby.shops': 'दुकानें',
    'nearby.tents': 'तंबू',
    'nearby.ambulance': 'एम्बुलेंस',
    'nearby.call': 'कॉल',
    'nearby.directions': 'दिशाएं',
    'nearby.noFacilities': 'पास में नहीं मिला',
    
    // SMS Capture
    'sms.title': 'तेजस - SMS आपातकाल',
    'sms.offline': 'ऑफलाइन मोड - ऑटो SMS तैयार',
    'sms.location': 'स्थान:',
    'sms.willSend': 'SMS भेजा जाएगा: +91 9092023126 (ऑफलाइन मोड)',
    'sms.preparing': 'कैमरा तैयार हो रहा है...',
  },
  tcy: {
    // Header
    'app.title': 'ತೇಜಸ್',
    'app.subtitle': 'ಎಮರ್ಜೆನ್ಸಿ ಅಲರ್ಟ್ ಸಿಸ್ಟಮ್',
    
    // Main page
    'main.title': 'ಎಮರ್ಜೆನ್ಸಿ ರೆಸ್ಪಾನ್ಸ್ ಸಿಸ್ಟಮ್',
    'main.subtitle': 'ತಮಿಳುನಾಡು ಅಕ್ಲೆ ಎಮರ್ಜೆನ್ಸಿ ಸರ್ವಿಸ್‌ಗೆ ಬೇಗನೆ ಪೊಂಪುವೆರ್',
    'main.snapToSave': 'ಸ್ನ್ಯಾಪ್ ಟು ಸೇವ್',
    'main.goToSave': 'ಗೋ ಟು ಸೇವ್',
    'main.smsToSave': 'SMS ಟು ಸೇವ್',
    
    // Emergency contacts
    'contacts.title': 'ಎಮರ್ಜೆನ್ಸಿ ಕಾಂಟ್ಯಾಕ್ಟ್‌ಲು',
    'contacts.ambulance': 'ಆಂಬುಲೆನ್ಸ್',
    'contacts.police': 'ಪೊಲೀಸ್',
    'contacts.fire': 'ಫೈರ್ ಸರ್ವಿಸ್',
    'contacts.disaster': 'ಎಮರ್ಜೆನ್ಸಿ ಡಿಸಾಸ್ಟರ್',
    'contacts.women': 'ಪೊಂಬರ ಹೆಲ್ಪ್‌ಲೈನ್',
    
    // About section
    'about.title': 'ತಮಿಳುನಾಡು ಮೆಡಿಕಲ್ ಸರ್ವಿಸ್‌ಲೆರ್ ಬಗ್ಗೆ',
    'about.description': 'ತಮಿಳುನಾಡುದ ಅಕ್ಲಾ ಜಿಲ್ಲೆಲೆಡ್ ಎಮರ್ಜೆನ್ಸಿ ಸರ್ವಿಸ್‌ದ ಸಂಗ್ ಸರ್ಕಾರಿ ಅಂಚೆನೆ ಪ್ರೈವೇಟ್ ಆಸ್ಪತ್ರೆಲು ಉಂಡು. ತೇಜಸ್ ಆಪ್ ಎಮರ್ಜೆನ್ಸಿ ಸಮಯೊಡು ಹತ್ತಿರದ ಮೆಡಿಕಲ್ ಫೆಸಿಲಿಟಿಲೆನ್ ಬೇಗನೆ ಕಂಡುಪಿಡಿಪೆರ್ಗ್ ಸಹಾಯ ಮಲ್ಪುಂಡು.',
    
    // Footer
    'footer.title': 'ತೇಜಸ್ ಎಮರ್ಜೆನ್ಸಿ ಅಲರ್ಟ್ ಸಿಸ್ಟಮ್',
    'footer.copyright': '© 2025 ಅಕ್ಲಾ ಹಕ್ಕುಲು ಕಾಪಾಡ್‌ದುಂಡು',
    
    // Nearby facilities
    'nearby.title': 'ತೇಜಸ್ - ತಮಿಳುನಾಡು ಅಕ್ಲೆ ಮೆಡಿಕಲ್ ಸಹಾಯ',
    'nearby.showing': 'ತಮಿಳುನಾಡು ಅಕ್ಲೆ ಮೆಡಿಕಲ್ ಫೆಸಿಲಿಟಿಲೆನ್ ತೋಜುಂಡು',
    'nearby.hospitals': 'ಆಸ್ಪತ್ರೆಲು',
    'nearby.shops': 'ಅಂಗಡಿಲು',
    'nearby.tents': 'ಟೆಂಟ್‌ಲು',
    'nearby.ambulance': 'ಆಂಬುಲೆನ್ಸ್',
    'nearby.call': 'ಕಾಲ್',
    'nearby.directions': 'ದಾರಿಲು',
    'nearby.noFacilities': 'ಹತ್ತಿರ ಸಿಗ್‌ಜಿಲ್ಲ',
    
    // SMS Capture
    'sms.title': 'ತೇಜಸ್ - SMS ಎಮರ್ಜೆನ್ಸಿ',
    'sms.offline': 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ - ಆಟೋ SMS ರೆಡಿ',
    'sms.location': 'ಜಾಗೊ:',
    'sms.willSend': 'SMS ಕಳಿಸ್‌ತುಂಡು: +91 9092023126 (ಆಫ್‌ಲೈನ್ ಮೋಡ್)',
    'sms.preparing': 'ಕ್ಯಾಮೆರಾ ತಯಾರ್ ಮಲ್ಪುಂಡು...',
  }
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
