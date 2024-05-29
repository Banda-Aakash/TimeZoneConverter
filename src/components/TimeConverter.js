import React, { useState } from 'react';
import Select from 'react-select';
import TimezoneCard from './TimezoneCard';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// import '../App.css'
import './t.css'

const TimeConverter = () => {
  const [timezones] = useState([
    { label: 'Indian Standard Time', value: 'Local Time', offset: 5.5, currentTime: new Date().getHours() * 60 + new Date().getMinutes(), checked: true },
    { label: 'New York', value: 'New York', offset: -4, currentTime: (new Date().getUTCHours() - 4) * 60 + new Date().getUTCMinutes(), checked: true },
    { label: 'London', value: 'London', offset: 1, currentTime: (new Date().getUTCHours() + 1) * 60 + new Date().getUTCMinutes(), checked: true },
    { label: 'Tokyo', value: 'Tokyo', offset: 9, currentTime: (new Date().getHours() + 3.5) * 60 + new Date().getUTCMinutes(), checked: true }
    // Add more timezones as needed
  ]);

  const [selectedTimezones, setSelectedTimezones] = useState([]);
  const [shareableLink, setShareableLink] = useState('');

  const[darkMode,setDarkMode]=useState(false);

    // Function to generate Google Calendar link
  const generateGoogleCalendarLink = () => {
    if (selectedTimezones.length === 0) {
      console.error('No timezones selected.');
      return;
    }

    const selectedStartTimezone = selectedTimezones[0]; // Take the first selected timezone for start time
    const selectedEndTimezone = selectedTimezones[0];
    console.log(selectedEndTimezone.currentTime)
    const startTime = formatTime(selectedStartTimezone.currentTime); // Format selected start time
    const endTime = formatTime((selectedEndTimezone.currentTime + 120)); // Format selected end time

    const description = `Meeting scheduled from ${startTime} to ${endTime}`; // Construct description

    const googleCalendarLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=Meeting&dates=2024-04-22T${startTime}/2024-04-22T${endTime}&details=${description}&location=${selectedStartTimezone.label}`;

    window.open(googleCalendarLink, "_blank");
  };


  const handleRemove = (index) => {
    const newSelectedTimezones = selectedTimezones.filter((_, i) => i !== index);
    setSelectedTimezones(newSelectedTimezones);
  };

  const handleTimeChange = (index, event) => {
    // event.stopPropagation();
    const newTime = parseInt(event.target.value);
    const newSelectedTimezones = [...selectedTimezones];
    newSelectedTimezones.forEach((timezone, i) => {
      const localTime = selectedTimezones[index].currentTime;
      const offsetDifference = timezone.offset - selectedTimezones[index].offset;
      const adjustedTime = (localTime + (offsetDifference * 60) + newTime - selectedTimezones[index].currentTime + 1440) % 1440;
      newSelectedTimezones[i].currentTime = adjustedTime;
    });
    setSelectedTimezones(newSelectedTimezones);
  };

  const formatTime = (time) => {
    let hours = Math.floor(time / 60);
    let minutes = time % 60;
    if(hours>=18 || hours<6){
      setDarkMode(true);
    }
    else{
      setDarkMode(false);
    }
    let meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${meridiem}`;
  };

  const moveCard = (dragIndex, hoverIndex) => {
    const dragItem = selectedTimezones[dragIndex];
    const newTimezones = [...selectedTimezones];
    newTimezones.splice(dragIndex, 1);
    newTimezones.splice(hoverIndex, 0, dragItem);
    setSelectedTimezones(newTimezones);
  };

  const handleSelect = (selectedOption) => {
    if (selectedOption) {
      let defaultTime;
      const selectedTimezone = timezones.find(timezone => timezone.value === selectedOption.value);
      if (selectedTimezones.length > 0) {
        const previousTimezone = selectedTimezones[selectedTimezones.length - 1];
        // Calculate the default time based on the offset difference
        const offsetDifference = selectedTimezone.offset - previousTimezone.offset;
        defaultTime = (previousTimezone.currentTime + (offsetDifference * 60) + 1440) % 1440;
      } else {
        // If no timezone is selected yet, use the current time adjusted by the offset
        defaultTime = (new Date().getUTCHours() + selectedTimezone.offset) * 60 + new Date().getUTCMinutes();
      }
      const newSelectedTimezones = [
        ...selectedTimezones,
        { ...selectedTimezone, currentTime: defaultTime }
      ];
      setSelectedTimezones(newSelectedTimezones);
    }
  };


  const reverseTimezones = () => {
    setSelectedTimezones([...selectedTimezones].reverse());
  };

  const renderMarks = () => {
    const marks = [
      { value: 0, label: '12am' },
      { value: 180, label: '3am' },
      { value: 360, label: '6am' },
      { value: 540, label: '9am' },
      { value: 720, label: '12pm' },
      { value: 900, label: '3pm' },
      { value: 1080, label: '6pm' },
      { value: 1260, label: '9pm' },
      // { value: 1439, label: '11:59pm' }
    ];

    return marks.map(mark => (
      <span key={mark.value} style={{ position: 'absolute', left: `${(mark.value / 1440) * 100}%`, transform: 'translateX(-50%)', fontSize: '1rem' }}>
        {mark.label}
      </span>
    ));
  };

  const generateShareableLink = () => {
    // Extracting only the desired properties from each timezone
    const formattedTimezones = selectedTimezones.map(zone => ({
      label: zone.label,
      value: zone.value,
      currentTime: formatTime(zone.currentTime)
    }));

    // Convert the formattedTimezones array to a string
    const timezonesString = JSON.stringify(formattedTimezones);

    // Construct the URL with the timezones string appended
    const url = `${window.location.origin}${window.location.pathname}?timezones=${timezonesString}`;

    // Set the shareable link state
    setShareableLink(url);
  };

  return (
    <div className={`${darkMode ? 'dark-mode' : 'lite-mode'}`}>
      <div className="container-fluid mt-5" >
        <div className="mb-3" style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '30%' }}>
            <Select
              options={timezones.filter(timezone => !selectedTimezones.some(selected => selected.value === timezone.value))}
              onChange={handleSelect}
              placeholder="Select a timezone to add"
            />
          </div>
          <button className="btn btn-primary mb-3" style={{ marginLeft: '10px', marginTop: '16px' }} onClick={reverseTimezones}>Swap Timezones</button>
          <button className="btn btn-primary mb-3" style={{ marginTop: '16px', marginLeft: '10px' }} onClick={generateShareableLink}>Get Shareable Link</button>
          <button className="btn btn-primary mb-3" style={{ marginTop: '16px', marginLeft: '10px' }} onClick={generateGoogleCalendarLink}>Schedule meet</button>
        </div>
        {shareableLink && (
          <div className="shareable-link">
            <p>Shareable Link:</p>
            <input type="text" value={shareableLink} readOnly />
            <button className='btn btn-primary' style={{ marginLeft: '10px' }} onClick={() => navigator.clipboard.writeText(shareableLink)}>Copy Link</button>
          </div>
        )}
        <DndProvider backend={HTML5Backend}>
          {selectedTimezones.map((timezone, index) => (
            <TimezoneCard
              key={index}
              timezone={timezone}
              index={index}
              handleRemove={handleRemove}
              handleTimeChange={handleTimeChange}
              formatTime={formatTime}
              renderMarks={renderMarks}
              moveCard={moveCard}
            />
          ))}
        </DndProvider>
      </div>
    </div>
  );
};

export default TimeConverter;