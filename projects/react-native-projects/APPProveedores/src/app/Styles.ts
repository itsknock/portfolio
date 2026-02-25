// Styles.ts (responsive)
import { StyleSheet, StatusBar, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Breakpoints
const IS_SMALL = SCREEN_WIDTH < 380;
const IS_MEDIUM = SCREEN_WIDTH >= 380 && SCREEN_WIDTH < 600;

const IMAGE_SIZE = IS_SMALL ? 56 : IS_MEDIUM ? 72 : 80;
const ITEM_PADDING = IS_SMALL ? 10 : IS_MEDIUM ? 14 : 16;
const ITEM_MARGIN_V = IS_SMALL ? 6 : 10;
const HORIZONTAL_PADDING = IS_SMALL ? 16 : 50;
const TITLE_FONT = IS_SMALL ? 16 : 18;
const FIELD_FONT = IS_SMALL ? 13 : 15;

export default StyleSheet.create({

  //Header
  headerContainer: {
    paddingTop: 35,
    paddingBottom: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#444444ff',
  },
  headerText: {
    fontSize: 35,
    fontWeight: '500',
    fontFamily: 'System',
    color: '#ffffffff',
  },

  //Flatlist - wrapper adjustments moved to components but keep general styles here
  vendorListItem: {
    backgroundColor: '#ffffff',
    padding: ITEM_PADDING,
    marginVertical: ITEM_MARGIN_V,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e6e6e6',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    flexDirection: 'column',
    flexWrap: 'wrap',   
    // do not force flex:1 here — let the parent/column wrapper control width
    // but allow the item to shrink vertically when needed
    alignItems: 'flex-start', // align to top so wrapped text grows from top not centered
  },
  // in styles for vendorListItem


  vendorListItemHomologado: {
    borderLeftWidth: 6,
    borderLeftColor: '#2a9d8fff',
    backgroundColor: '#e5fef2ff',
  },
  textHomologado: {
    color: '#0cb09dff',
  },

  vendorListContainer: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    padding: 15,
  },
  vendorImage: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    marginRight: IS_SMALL ? 12 : 30,
    marginLeft: 10,
    borderRadius: IMAGE_SIZE / 2,
    // allow image to remain fixed and not force parent min width
    flexShrink: 0,
  },

  vendorCountText: {
    fontSize: 20,
    fontFamily: 'System',
    color: '#acfed7ff',
    fontWeight: '700',
    marginLeft: 40,
    marginRight: 20,
  },

  //Pressables
  addVendorPressable: {
    backgroundColor: '#2a9d8fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cancelModifyVendorPressable: {
    backgroundColor: '#264653',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  filterVendorPressable: {
  
    backgroundColor: '#2a9d8f',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 12,
    marginLeft: 10,
  },
  PressableText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  modifyVendorPressable: {
    backgroundColor: '#264653',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    

  },
  deleteVendorPressable: {
    backgroundColor: '#111',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 10,
    
  },
  actionText: { color: '#fafafa', fontWeight: '600' },

  //textbox (form)
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#000000ff",
    borderRadius: 8,
    overflow: "hidden",
    width: 155,
    marginLeft: 5,
    marginBottom: 14,
  },
  //filters container
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 20,
    marginBottom: 30,
    flexWrap: 'wrap',
    backgroundColor: '#444444ff',
  },

  searchBar: {
    flexDirection: 'row',
    borderColor: '#ccc',
    backgroundColor: '#ffffffff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginLeft: 30,
    flex: 1,
    minWidth: 200,
    height: 40,
  },

  //modal (modify vendor)
  vendorImageModal: {
    width: 100,
    height: 100,
    marginTop:7,
    marginBottom:5,
    marginLeft: 10,
    borderRadius: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
  paddingTop: 40,
  padding: 20,
  width: '95%',        // Full responsive width
  maxWidth: 700,
  height: '80%',       
  backgroundColor: '#fff',
  borderRadius: 8,
},

  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 24,
    marginTop: 19,
  },
  modalFieldText: {
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 15,
    textAlign: 'left',
    fontSize: 15,
  },
  dropdownField: {
  flex: 1,              // Fills available space equally
  minHeight: 40,
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 4,
  paddingHorizontal: 12,
},
dropdown: {
  flex: 1,
  height: 50,
  marginVertical: 5,
},
placeholderStyle: {
  fontSize: 16,
  color: '#666',
},
selectedTextStyle: {
  fontSize: 16,
  fontWeight: '500',
},



dropdownRow: {
  flexDirection: 'row',
  gap: 130,          // Increased from 30 to 50px - much more separation
  alignItems: 'flex-start',
  paddingHorizontal: 0,
},

dropdownWrapper: {
  width: 140,

},
dropdownContainer: {
  height: 50,
  marginVertical: 5,
  justifyContent: 'center',
},



  containerModalImagePressables: {
  flexDirection: 'row',
  justifyContent: 'center',   // centers along the main axis (horizontal here)
  alignItems: 'center',       // centers along the cross axis (vertical)
  marginVertical: 10,
},


  imageButtonsContainer: {
    flexDirection: 'column',
    gap: 10,
  },

  
  picker: {
    height: 40,
  },

  //----------- content inside item
  vendorContent: {
  flex: 1,
  minWidth: 0,
  flexShrink: 1,
  },


  vendorTitle: {
  fontSize: TITLE_FONT,
  fontWeight: '700',
  color: '#222',
  marginBottom: 6,
  minWidth: 0,
  flexShrink: 1,
  },
  

  vendorItemFieldLabel: {
    fontSize: FIELD_FONT,
    fontWeight: '600',
  },
  // Styles.ts (or Styles.js) — add this object to your styles
vendorItemValue: {
  flexShrink: 1,
  minWidth: 0,
},

  vendorMeta: {
    color: '#444',
    fontSize: IS_SMALL ? 12 : 14,
    marginBottom: 3,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },

  // Global container padding used by parent components if they rely on this file
  globalWrapper: {
    paddingHorizontal: HORIZONTAL_PADDING,
  },
});
