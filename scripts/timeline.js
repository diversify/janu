function calculateWidths(numSpans){
	if(numSpans)
		return (100.0/numSpans);
	else
		return 100;
}
function renderTimeline(numSpans){
	$(".timeline-span").css('width',calculateWidths(numSpans)+"%");
	$(".timeline-span ng-scope").css('width',calculateWidths(numSpans)+"%");
}