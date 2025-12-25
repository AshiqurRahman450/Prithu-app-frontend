import React, { forwardRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import CommentsContent from '../../screens/comment/CommentSheet';

const BottomSheetComments = forwardRef((props, ref) => {
  // bottom sheet snap points
  const snapPoints = useMemo(() => ['50%', '90%'], []);

  return (
    <BottomSheet
      ref={ref}
      index={-1} // initially closed
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: '#fff', borderRadius: 20 }}
    >
      <View style={{ flex: 1 }}>
        <CommentsContent /> 
      </View>
    </BottomSheet>
  );
});

export default BottomSheetComments;