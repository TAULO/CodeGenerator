const data = [
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Push - barbell bench press 4x15, incline dumbbell bench press 4x15, medium cable fly 3x15, seated dumbbell overhead press 4x15, standing dumbbell lateral raise 3x15, standing cable tricep pushdown rope 4x15, standing dumbbell overhead tricep extensions 3x15' },
            { day: '2', value: 'Pull - overhand grip lat pulldown 4x15, single arm dumbbell row 4x15, seated cable row neutral grip 4x15, standing dumbbell shrugs 3x15, standing dumbbell curl 4x15, standing dumbbell hammer curl 4x15' },
            { day: '3', value: 'Legs - barbell back squat 4x15-18, dumbbell lunge 4x15-18, leg press 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18' }
        ]
    }, // 1
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Push - incline barbell bench press 4x15, decline barbell bench press 4x15, dumbbell fly 3x15, seated barbell overhead press 4x15, seated dumbbell lateral raise 3x15, standing cable tricep pushdown straight bar 4x15, seated dumbbell overhead tricep extensions 3x15' },
            { day: '2', value: 'Pull - wide grip lat pulldown 4x15, neutral grip lat pulldown 4x15, seated cable row wide grip 4x15, rear delt machine 4x15, EZ bar preacher curl 3x15, standing dumbbell hammer curl 3x15' },
            { day: '3', value: 'Legs - barbell back squat 4x15-18, dumbbell lunge 4x15-18, leg press 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18' }
        ]
    }, // 2
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Push - push up 5x15-18, incline dumbbell bench press 4x15, chest fly machine 4x15, Dips 3x12-15, seated barbell overhead press 4x15, barbell upright row 4x15, dumbbell skull crusher 3x15, bench dips 3x15' },
            { day: '2', value: 'Pull - deadlifts 5x15, wide grip pull up 4x15, neutral grip pull up 4x15, bent over barbell row 4x15, rear delt machine 4x15, standing dumbbell shrugs 4x15, concentration curl 4x15, H bar preacher curl 4x15' },
            { day: '3', value: 'Legs - barbell back squat 4x15-18, front rack barbell lunge 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18, smith machine standing calf raise 4x15-18' }
        ]
    }, // 3
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Push - barbell bench press 4x12, incline dumbbell bench press 4x12, medium cable fly 3x12, seated dumbbell overhead press 4x12, standing dumbbell lateral raise 3x12, standing cable tricep pushdown, rope 4x12, standing dumbbell overhead tricep extensions 3x12' },
            { day: '2', value: 'Pull - overhand grip lat pulldown 4x12, single arm dumbbell row 4x12, seated cable row neutral grip 4x12, standing dumbbell shrugs 3x12, standing dumbbell curl 4x12, standing dumbbell hammer curl 4x12' },
            { day: '3', value: 'Legs - barbell back squat 4x12-15, dumbbell lunge 4x12-15, leg press 4x12-15, leg extension 4x12-15, seated calf raise machine 4x15-18' }
        ]
    }, // 4
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Push - incline barbell bench press 4x12, decline barbell bench press 4x12, dumbbell fly 3x12, seated barbell overhead press 4x12, seated dumbbell lateral raise 3x12, standing cable tricep pushdown straight bar 4x12, seated dumbbell overhead tricep extensions 3x12' },
            { day: '2', value: 'Pull - wide grip lat pulldown 4x12, neutral grip lat pulldown 4x12, seated cable row wide grip 4x12, rear delt machine 4x12, EZ bar preacher curl 3x12, standing dumbbell hammer curl 3x12' },
            { day: '3', value: 'Legs - barbell back squat 4x12-15, dumbbell lunge 4x12-15, leg press 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15' }
        ]
    }, // 5
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Push - push up 5x12-15, incline dumbbell bench press 4x12, chest fly machine 4x12, Dips 3x10-12, seated barbell overhead press 4x12, barbell upright row 4x12, dumbbell skull crusher 3x12, bench dips 3x12' },
            { day: '2', value: 'Pull - deadlifts 5x12, wide grip pull up 4x12, neutral grip pull up 4x12, bent over barbell row 4x12, rear delt machine 4x12, standing dumbbell shrugs 4x12, concentration curl 4x12, H bar preacher curl 4x12' },
            { day: '3', value: 'Legs - barbell back squat 4x12-15, front rack barbell lunge 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15, smith machine standing calf raise 4x12-15' }
        ]
    }, // 6
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Push - barbell bench press 4x8-10, incline dumbbell bench press 4x8-10, medium cable fly 3x10, seated dumbbell overhead press 4x8-10, standing dumbbell lateral raise 3x10, standing cable tricep pushdown, rope 4x8-10, standing dumbbell overhead tricep extensions 3x10' },
            { day: '2', value: 'Pull - overhand grip lat pulldown 4x8-10, single arm dumbbell row 4x8-10, seated cable row neutral grip 4x8-10, standing dumbbell shrugs 3x10, standing dumbbell curl 4x8-10, standing dumbbell hammer curl 4x8-10' },
            { day: '3', value: 'Legs - barbell back squat 4x10-12, dumbbell lunge 4x10-12, leg press 4x10-12, leg extension 4x10-12' }
        ]
    }, // 7
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Push - incline barbell bench press 4x8-10, decline barbell bench press 4x8-10, dumbbell fly 3x8-10, seated barbell overhead press 4x8-10, seated dumbbell lateral raise 3x8-10, standing cable tricep pushdown straight bar 4x8-10, seated dumbbell overhead tricep extensions 3x8-10' },
            { day: '2', value: 'Pull - wide grip lat pulldown 4x8-10, neutral grip lat pulldown 4x8-10, seated cable row wide grip 4x8-10, rear delt machine 4x8-10, EZ bar preacher curl 3x8-10, standing dumbbell hammer curl 3x8-10' },
            { day: '3', value: 'Legs - barbell back squat 4x10-12, dumbbell lunge 4x10-12, leg press 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12' }
        ]
    }, // 8
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Push - push up 5x10-12, incline dumbbell bench press 4x8-10, chest fly machine 4x8-10, Dips 3x8-10, seated barbell overhead press 4x8-10, barbell upright row 4x8-10, dumbbell skull crusher 3x8-10, bench dips 3x8-10' },
            { day: '2', value: 'Pull - deadlifts 5x8-10, wide grip pull up 4x8-10, neutral grip pull up 4x8-10, bent over barbell row 4x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 4x8-10, concentration curl 4x8-10, H bar preacher curl 4x8-10' },
            { day: '3', value: 'Legs - barbell back squat 4x10-12, front rack barbell lunge 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12, smith machine standing calf raise 4x10-12' }
        ]
    }, // 9
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - overhand grip lat pulldown 4x15, single arm dumbbell row 4x15, seated cable row neutral grip 4x15, standing dumbbell curl 4x15, standing dumbbell hammer curl 4x15' },
            { day: '2', value: 'Chest + Triceps - barbell bench press 4x15, incline dumbbell bench press 4x15, medium cable fly 3x15, standing cable tricep pushdown rope 4x15, standing dumbbell overhead tricep extensions 4x15' },
            { day: '3', value: 'Shoulders + Traps - seated dumbbell overhead press 4x15, standing dumbbell lateral raise 4x15, rear delt machine 4x15, standing dumbbell shrugs 5x15,' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x15-18, dumbbell lunge 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18, situps 4x15, abs machine 4x15' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 10
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - wide grip lat pulldown 4x15, neutral grip lat pulldown 4x15, seated cable row wide grip 4x15, EZ bar preacher curl 4x15, standing dumbbell hammer curl 4x15' },
            { day: '2', value: 'Chest + Triceps - incline barbell bench press 4x15, decline barbell bench press 4x15, dumbbell fly 4x15, standing cable tricep pushdown straight bar 4x15, seated dumbbell overhead tricep extensions 4x15' },
            { day: '3', value: 'Shoulders + Traps - seated barbell overhead press 4x15, seated dumbbell lateral raise 3x15, rear delt machine 4x15, standing dumbbell shrugs 5x15' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x15-18, dumbbell lunge 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18, situps 4x15, abs machine 4x15' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 11
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - deadlifts 5x15, wide grip pull up 4x15, neutral grip pull up 4x15, bent over barbell row 4x15, concentration curl 4x15, H bar preacher curl 4x15' },
            { day: '2', value: 'Chest + Triceps - push up 5x15-18, incline dumbbell bench press 4x15, chest fly machine 4x15, dips 3x12-15, dumbbell skull crusher 4x15, bench dips 4x15' },
            { day: '3', value: 'Shoulders + Traps - seated barbell overhead press 4x15, barbell upright row 4x15, rear delt machine 4x15, standing dumbbell shrugs 4x15' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x15-18, front rack barbell lunge 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18, smith machine standing calf raise 4x15-18, situps 4x15, abs machine 4x15' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 12
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - overhand grip lat pulldown 4x12, single arm dumbbell row 4x12, seated cable row neutral grip 4x12, standing dumbbell curl 4x12, standing dumbbell hammer curl 4x12' },
            { day: '2', value: 'Chest + Triceps - barbell bench press 4x12, incline dumbbell bench press 4x12, medium cable fly 3x12, standing cable tricep pushdown rope 4x12, standing dumbbell overhead tricep extensions 4x12' },
            { day: '3', value: 'Shoulders + Traps - seated dumbbell overhead press 4x12, standing dumbbell lateral raise 4x12, rear delt machine 4x12, standing dumbbell shrugs 5x12,' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x12-15, dumbbell lunge 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15, situps 4x12, abs machine 4x12' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 13
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - wide grip lat pulldown 4x12, neutral grip lat pulldown 4x12, seated cable row wide grip 4x12, EZ bar preacher curl 4x12, standing dumbbell hammer curl 4x12' },
            { day: '2', value: 'Chest + Triceps - incline barbell bench press 4x12, decline barbell bench press 4x12, dumbbell fly 4x12, standing cable tricep pushdown straight bar 4x12, seated dumbbell overhead tricep extensions 4x12' },
            { day: '3', value: 'Shoulders + Traps - seated barbell overhead press 4x12, seated dumbbell lateral raise 3x12, rear delt machine 4x12, standing dumbbell shrugs 5x12' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x12-15, dumbbell lunge 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15, situps 4x12, abs machine 4x12' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 14
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - deadlifts 5x12, wide grip pull up 4x12, neutral grip pull up 4x12, bent over barbell row 4x12, concentration curl 4x12, H bar preacher curl 4x12' },
            { day: '2', value: 'Chest + Triceps - push up 5x12-15, incline dumbbell bench press 4x12, chest fly machine 4x12, dips 3x10-12, dumbbell skull crusher 4x12, bench dips 4x12' },
            { day: '3', value: 'Shoulders + Traps - seated barbell overhead press 4x12, barbell upright row 4x12, rear delt machine 4x12, standing dumbbell shrugs 4x12' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x12-15, front rack barbell lunge 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15, smith machine standing calf raise 4x12-15, situps 4x12, abs machine 4x12' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 15
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - overhand grip lat pulldown 4x8-10, single arm dumbbell row 4x8-10, seated cable row neutral grip 4x8-10, standing dumbbell curl 4x8-10, standing dumbbell hammer curl 4x8-10' },
            { day: '2', value: 'Chest + Triceps - barbell bench press 4x8-10, incline dumbbell bench press 4x8-10, medium cable fly 3x8-10, standing cable tricep pushdown rope 4x8-10, standing dumbbell overhead tricep extensions 4x8-10' },
            { day: '3', value: 'Shoulders + Traps - seated dumbbell overhead press 4x8-10, standing dumbbell lateral raise 4x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 5x8-10' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x10-12, dumbbell lunge 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12, situps 4x10, abs machine 4x10' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 16
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - wide grip lat pulldown 4x8-10, neutral grip lat pulldown 4x8-10, seated cable row wide grip 4x8-10, EZ bar preacher curl 4x8-10, standing dumbbell hammer curl 4x8-10' },
            { day: '2', value: 'Chest + Triceps - incline barbell bench press 4x8-10, decline barbell bench press 4x8-10, dumbbell fly 4x8-10, standing cable tricep pushdown straight bar 4x8-10, seated dumbbell overhead tricep extensions 4x8-10' },
            { day: '3', value: 'Shoulders + Traps - seated barbell overhead press 4x8-10, seated dumbbell lateral raise 3x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 5x8-10' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x10-12, dumbbell lunge 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12, situps 4x10, abs machine 4x10' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 17
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - deadlifts 5x8-10, wide grip pull up 4x8-10, neutral grip pull up 4x8-10, bent over barbell row 4x8-10, concentration curl 4x8-10, H bar preacher curl 4x8-10' },
            { day: '2', value: 'Chest + Triceps - push up 5x10-12, incline dumbbell bench press 4x8-10, chest fly machine 4x8-10, dips 3x8-10, dumbbell skull crusher 4x8-10, bench dips 4x8-10' },
            { day: '3', value: 'Shoulders + Traps - seated barbell overhead press 4x8-10, barbell upright row 4x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 4x8-10' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x10-12, front rack barbell lunge 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12, smith machine standing calf raise 4x10-12, situps 4x10, abs machine 4x10' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 18
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Back - overhand grip lat pulldown 4x15, neutral grip lat pulldown 4x15, single arm dumbbell row 4x15, seated cable row neutral grip 4x15' },
            { day: '2', value: 'Chest - barbell bench press 4x15, incline dumbbell bench press 4x15, selector chest press machine 4x15, medium cable fly 4x15' },
            { day: '3', value: 'Arms - standing dumbbell curl 4x15, standing dumbbell hammer curl 4x15, standing cable tricep pushdown rope 4x15, standing dumbbell overhead tricep extensions 4x15' },
            { day: '4', value: 'Legs - barbell back squat 4x15-18, dumbbell lunge 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18' },
            { day: '5', value: 'Shoulders - seated dumbbell overhead press 4x15, standing dumbbell lateral raise 4x15, rear delt machine 4x15, standing dumbbell shrugs 5x15' },
            { day: '6', value: 'Abs - situps 4x15, abs machine 4x15, hanging knee raise 4x15, decline crunches 4x15' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 19
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Back - wide grip lat pulldown 4x15, neutral grip lat pulldown 4x15, seated cable row wide grip 4x15, TBar row 4x15' },
            { day: '2', value: 'Chest - incline barbell bench press 4x15, decline barbell bench press 4x15, dumbbell bench press 4x15, dumbbell fly 4x15' },
            { day: '3', value: 'Arms - EZ bar preacher curl 4x15, standing dumbbell hammer curl 4x15, standing cable tricep pushdown straight bar 4x15, seated dumbbell overhead tricep extensions 4x15' },
            { day: '4', value: 'Legs - barbell back squat 4x15-18, dumbbell lunge 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18' },
            { day: '5', value: 'Shoulders - seated barbell overhead press 4x15, seated dumbbell lateral raise 4x15, rear delt machine 4x15, standing dumbbell shrugs 5x15' },
            { day: '6', value: 'Abs - situps 4x15, abs machine 4x15, hanging knee raise 4x15, decline crunches 4x15' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 20
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Back - deadlifts 5x15, wide grip pull up 4x15, neutral grip pull up 4x15, bent over barbell row 4x15' },
            { day: '2', value: 'Chest - push up 5x15-18, incline dumbbell bench press 4x15, chest fly machine 4x15, dips 3x12-15' },
            { day: '3', value: 'Arms - concentration curl 4x15, H bar preacher curl 4x15, dumbbell skull crusher 4x15, bench dips 4x15' },
            { day: '4', value: 'Legs - barbell back squat 4x15-18, front rack barbell lunge 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18, smith machine standing calf raise 4x15-18' },
            { day: '5', value: 'Shoulders - seated barbell overhead press 4x15, barbell upright row 4x15, rear delt machine 4x15, standing dumbbell shrugs 4x15' },
            { day: '6', value: 'Abs - situps 4x15, abs machine 4x15, hanging knee raise 4x15, decline crunches 4x15' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 21
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Back - overhand grip lat pulldown 4x15, neutral grip lat pulldown 4x12, single arm dumbbell row 4x12, seated cable row neutral grip 4x12' },
            { day: '2', value: 'Chest - barbell bench press 4x12, incline dumbbell bench press 4x12, selector chest press machine 4x12, medium cable fly 4x12' },
            { day: '3', value: 'Arms - standing dumbbell curl 4x12, standing dumbbell hammer curl 4x12, standing cable tricep pushdown rope 4x12, standing dumbbell overhead tricep extensions 4x12' },
            { day: '4', value: 'Legs - barbell back squat 4x12-15, dumbbell lunge 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15' },
            { day: '5', value: 'Shoulders - seated dumbbell overhead press 4x12, standing dumbbell lateral raise 4x12, rear delt machine 4x12, standing dumbbell shrugs 5x12' },
            { day: '6', value: 'Abs - situps 4x12, abs machine 4x12, hanging knee raise 4x12, decline crunches 4x12' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 22
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Back - wide grip lat pulldown 4x12, neutral grip lat pulldown 4x12, seated cable row wide grip 4x12, TBar row 4x12' },
            { day: '2', value: 'Chest - incline barbell bench press 4x12, decline barbell bench press 4x12, dumbbell bench press 4x12, dumbbell fly 4x12' },
            { day: '3', value: 'Arms - EZ bar preacher curl 4x12, standing dumbbell hammer curl 4x12, standing cable tricep pushdown straight bar 4x12, seated dumbbell overhead tricep extensions 4x12' },
            { day: '4', value: 'Legs - barbell back squat 4x12-15, dumbbell lunge 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15' },
            { day: '5', value: 'Shoulders - seated barbell overhead press 4x12, seated dumbbell lateral raise 4x12, rear delt machine 4x12, standing dumbbell shrugs 5x12' },
            { day: '6', value: 'Abs - situps 4x12, abs machine 4x12, hanging knee raise 4x12, decline crunches 4x12' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 23
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Back - deadlifts 5x12, wide grip pull up 4x12, neutral grip pull up 4x12, bent over barbell row 4x12' },
            { day: '2', value: 'Chest - push up 5x12-15, incline dumbbell bench press 4x12, chest fly machine 4x12, dips 3x10-12' },
            { day: '3', value: 'Arms - concentration curl 4x12, H bar preacher curl 4x12, dumbbell skull crusher 4x12, bench dips 4x12' },
            { day: '4', value: 'Legs - barbell back squat 4x12-15, front rack barbell lunge 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15, smith machine standing calf raise 4x12-15' },
            { day: '5', value: 'Shoulders - seated barbell overhead press 4x12, barbell upright row 4x12, rear delt machine 4x12, standing dumbbell shrugs 4x12' },
            { day: '6', value: 'Abs - situps 4x12, abs machine 4x12, hanging knee raise 4x12, decline crunches 4x12' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 24
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Back - overhand grip lat pulldown 4x8-10, neutral grip lat pulldown 4x8-10, single arm dumbbell row 4x8-10, seated cable row neutral grip 4x8-10' },
            { day: '2', value: 'Chest - barbell bench press 4x8-10, incline dumbbell bench press 4x8-10, selector chest press machine 4x8-10, medium cable fly 4x8-10' },
            { day: '3', value: 'Arms - standing dumbbell curl 4x8-10, standing dumbbell hammer curl 4x8-10, standing cable tricep pushdown rope 4x8-10, standing dumbbell overhead tricep extensions 4x8-10' },
            { day: '4', value: 'Legs - barbell back squat 4x10-12, dumbbell lunge 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12' },
            { day: '5', value: 'Shoulders - seated dumbbell overhead press 4x8-10, standing dumbbell lateral raise 4x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 5x8-10' },
            { day: '6', value: 'Abs - situps 4x8-10, abs machine 4x8-10, hanging knee raise 4x8-10, decline crunches 4x8-10' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 25
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Back - wide grip lat pulldown 4x8-10, neutral grip lat pulldown 4x8-10, seated cable row wide grip 4x8-10, TBar row 4x8-10' },
            { day: '2', value: 'Chest - incline barbell bench press 4x8-10, decline barbell bench press 4x8-10, dumbbell bench press 4x8-10, dumbbell fly 4x8-10' },
            { day: '3', value: 'Arms - EZ bar preacher curl 4x8-10, standing dumbbell hammer curl 4x8-10, standing cable tricep pushdown straight bar 4x8-10, seated dumbbell overhead tricep extensions 4x8-10' },
            { day: '4', value: 'Legs - barbell back squat 4x10-12, dumbbell lunge 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12' },
            { day: '5', value: 'Shoulders - seated barbell overhead press 4x8-10, seated dumbbell lateral raise 4x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 5x8-10' },
            { day: '6', value: 'Abs - situps 4x8-10, abs machine 4x8-10, hanging knee raise 4x8-10, decline crunches 4x8-10' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 26
    {
        premises: [
            { attribute: 'gender', value: 'm' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Back - deadlifts 5x8-10, wide grip pull up 4x8-10, neutral grip pull up 4x8-10, bent over barbell row 4x8-10' },
            { day: '2', value: 'Chest - push up 5x10-12, incline dumbbell bench press 4x8-10, chest fly machine 4x8-10, dips 3x8-10' },
            { day: '3', value: 'Arms - concentration curl 4x8-10, H bar preacher curl 4x8-10, dumbbell skull crusher 4x8-10, bench dips 4x8-10' },
            { day: '4', value: 'Legs - barbell back squat 4x10-12, front rack barbell lunge 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12, smith machine standing calf raise 4x10-12' },
            { day: '5', value: 'Shoulders - seated barbell overhead press 4x8-10, barbell upright row 4x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 4x8-10' },
            { day: '6', value: 'Abs - situps 4x8-10, abs machine 4x8-10, hanging knee raise 4x8-10, decline crunches 4x8-10' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 27
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Push - barbell bench press 4x15, incline dumbbell bench press 4x15, medium cable fly 3x15, seated dumbbell overhead press 4x15, standing dumbbell lateral raise 3x15, standing cable tricep pushdown rope 4x15, standing dumbbell overhead tricep extensions 3x15' },
            { day: '2', value: 'Pull - overhand grip lat pulldown 4x15, single arm dumbbell row 4x15, seated cable row neutral grip 4x15, standing dumbbell shrugs 3x15, standing dumbbell curl 4x15, standing dumbbell hammer curl 4x15' },
            { day: '3', value: 'Legs - barbell back squat 4x15-18, dumbbell lunge 4x15-18, leg press 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18' }
        ]
    }, // 28
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Push - incline barbell bench press 4x15, decline barbell bench press 4x15, dumbbell fly 3x15, seated barbell overhead press 4x15, seated dumbbell lateral raise 3x15, standing cable tricep pushdown straight bar 4x15, seated dumbbell overhead tricep extensions 3x15' },
            { day: '2', value: 'Pull - wide grip lat pulldown 4x15, neutral grip lat pulldown 4x15, seated cable row wide grip 4x15, rear delt machine 4x15, EZ bar preacher curl 3x15, standing dumbbell hammer curl 3x15' },
            { day: '3', value: 'Legs - barbell back squat 4x15-18, dumbbell lunge 4x15-18, leg press 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18' }
        ]
    }, // 29
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Push - push up 5x15-18, incline dumbbell bench press 4x15, chest fly machine 4x15, Dips 3x12-15, seated barbell overhead press 4x15, barbell upright row 4x15, dumbbell skull crusher 3x15, bench dips 3x15' },
            { day: '2', value: 'Pull - deadlifts 5x15, wide grip pull up 4x15, neutral grip pull up 4x15, bent over barbell row 4x15, rear delt machine 4x15, standing dumbbell shrugs 4x15, concentration curl 4x15, H bar preacher curl 4x15' },
            { day: '3', value: 'Legs - barbell back squat 4x15-18, front rack barbell lunge 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18, smith machine standing calf raise 4x15-18' }
        ]
    }, // 30
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Push - barbell bench press 4x12, incline dumbbell bench press 4x12, medium cable fly 3x12, seated dumbbell overhead press 4x12, standing dumbbell lateral raise 3x12, standing cable tricep pushdown, rope 4x12, standing dumbbell overhead tricep extensions 3x12' },
            { day: '2', value: 'Pull - overhand grip lat pulldown 4x12, single arm dumbbell row 4x12, seated cable row neutral grip 4x12, standing dumbbell shrugs 3x12, standing dumbbell curl 4x12, standing dumbbell hammer curl 4x12' },
            { day: '3', value: 'Legs - barbell back squat 4x12-15, dumbbell lunge 4x12-15, leg press 4x12-15, leg extension 4x12-15, seated calf raise machine 4x15-18' }
        ]
    }, // 31
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Push - incline barbell bench press 4x12, decline barbell bench press 4x12, dumbbell fly 3x12, seated barbell overhead press 4x12, seated dumbbell lateral raise 3x12, standing cable tricep pushdown straight bar 4x12, seated dumbbell overhead tricep extensions 3x12' },
            { day: '2', value: 'Pull - wide grip lat pulldown 4x12, neutral grip lat pulldown 4x12, seated cable row wide grip 4x12, rear delt machine 4x12, EZ bar preacher curl 3x12, standing dumbbell hammer curl 3x12' },
            { day: '3', value: 'Legs - barbell back squat 4x12-15, dumbbell lunge 4x12-15, leg press 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15' }
        ]
    }, // 32
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Push - push up 5x12-15, incline dumbbell bench press 4x12, chest fly machine 4x12, Dips 3x10-12, seated barbell overhead press 4x12, barbell upright row 4x12, dumbbell skull crusher 3x12, bench dips 3x12' },
            { day: '2', value: 'Pull - deadlifts 5x12, wide grip pull up 4x12, neutral grip pull up 4x12, bent over barbell row 4x12, rear delt machine 4x12, standing dumbbell shrugs 4x12, concentration curl 4x12, H bar preacher curl 4x12' },
            { day: '3', value: 'Legs - barbell back squat 4x12-15, front rack barbell lunge 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15, smith machine standing calf raise 4x12-15' }
        ]
    }, // 33
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Push - barbell bench press 4x8-10, incline dumbbell bench press 4x8-10, medium cable fly 3x10, seated dumbbell overhead press 4x8-10, standing dumbbell lateral raise 3x10, standing cable tricep pushdown, rope 4x8-10, standing dumbbell overhead tricep extensions 3x10' },
            { day: '2', value: 'Pull - overhand grip lat pulldown 4x8-10, single arm dumbbell row 4x8-10, seated cable row neutral grip 4x8-10, standing dumbbell shrugs 3x10, standing dumbbell curl 4x8-10, standing dumbbell hammer curl 4x8-10' },
            { day: '3', value: 'Legs - barbell back squat 4x10-12, dumbbell lunge 4x10-12, leg press 4x10-12, leg extension 4x10-12' }
        ]
    }, // 34
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Push - incline barbell bench press 4x8-10, decline barbell bench press 4x8-10, dumbbell fly 3x8-10, seated barbell overhead press 4x8-10, seated dumbbell lateral raise 3x8-10, standing cable tricep pushdown straight bar 4x8-10, seated dumbbell overhead tricep extensions 3x8-10' },
            { day: '2', value: 'Pull - wide grip lat pulldown 4x8-10, neutral grip lat pulldown 4x8-10, seated cable row wide grip 4x8-10, rear delt machine 4x8-10, EZ bar preacher curl 3x8-10, standing dumbbell hammer curl 3x8-10' },
            { day: '3', value: 'Legs - barbell back squat 4x10-12, dumbbell lunge 4x10-12, leg press 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12' }
        ]
    }, // 35
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '3' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Push - push up 5x10-12, incline dumbbell bench press 4x8-10, chest fly machine 4x8-10, Dips 3x8-10, seated barbell overhead press 4x8-10, barbell upright row 4x8-10, dumbbell skull crusher 3x8-10, bench dips 3x8-10' },
            { day: '2', value: 'Pull - deadlifts 5x8-10, wide grip pull up 4x8-10, neutral grip pull up 4x8-10, bent over barbell row 4x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 4x8-10, concentration curl 4x8-10, H bar preacher curl 4x8-10' },
            { day: '3', value: 'Legs - barbell back squat 4x10-12, front rack barbell lunge 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12, smith machine standing calf raise 4x10-12' }
        ]
    }, // 36
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - overhand grip lat pulldown 4x15, single arm dumbbell row 4x15, seated cable row neutral grip 4x15, standing dumbbell curl 4x15, standing dumbbell hammer curl 4x15' },
            { day: '2', value: 'Chest + Triceps - barbell bench press 4x15, incline dumbbell bench press 4x15, medium cable fly 3x15, standing cable tricep pushdown rope 4x15, standing dumbbell overhead tricep extensions 4x15' },
            { day: '3', value: 'Shoulders + Traps - seated dumbbell overhead press 4x15, standing dumbbell lateral raise 4x15, rear delt machine 4x15, standing dumbbell shrugs 5x15,' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x15-18, adduction machine 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18, situps 4x15, russian twist 4x15' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 37
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - wide grip lat pulldown 4x15, neutral grip lat pulldown 4x15, seated cable row wide grip 4x15, EZ bar preacher curl 4x15, standing dumbbell hammer curl 4x15' },
            { day: '2', value: 'Chest + Triceps - incline barbell bench press 4x15, decline barbell bench press 4x15, dumbbell fly 4x15, standing cable tricep pushdown straight bar 4x15, seated dumbbell overhead tricep extensions 4x15' },
            { day: '3', value: 'Shoulders + Traps - seated barbell overhead press 4x15, seated dumbbell lateral raise 3x15, rear delt machine 4x15, standing dumbbell shrugs 5x15' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x15-18, goblet squat 4x15-18, barbell hip thrust 4x15-18, seated calf raise machine 4x15-18, situps 4x15, hanging leg raise 4x15' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 38
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - deadlifts 5x15, wide grip pull up 4x15, neutral grip pull up 4x15, bent over barbell row 4x15, concentration curl 4x15, H bar preacher curl 4x15' },
            { day: '2', value: 'Chest + Triceps - push up 5x15-18, incline dumbbell bench press 4x15, chest fly machine 4x15, dips 3x12-15, dumbbell skull crusher 4x15, bench dips 4x15' },
            { day: '3', value: 'Shoulders + Traps - seated barbell overhead press 4x15, barbell upright row 4x15, rear delt machine 4x15, standing dumbbell shrugs 4x15' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x15-18, standing cable hip extension 4x15-18, barbell glute bridge 4x15-18, seated calf raise machine 4x15-18, smith machine standing calf raise 4x15-18, crunches 4x15, hanging leg raise 4x15' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 39
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - overhand grip lat pulldown 4x12, single arm dumbbell row 4x12, seated cable row neutral grip 4x12, standing dumbbell curl 4x12, standing dumbbell hammer curl 4x12' },
            { day: '2', value: 'Chest + Triceps - barbell bench press 4x12, incline dumbbell bench press 4x12, medium cable fly 3x12, standing cable tricep pushdown rope 4x12, standing dumbbell overhead tricep extensions 4x12' },
            { day: '3', value: 'Shoulders + Traps - seated dumbbell overhead press 4x12, standing dumbbell lateral raise 4x12, rear delt machine 4x12, standing dumbbell shrugs 5x12,' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x12-15, adduction machine 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15, situps 4x12, russian twist 4x12' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 40
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - wide grip lat pulldown 4x12, neutral grip lat pulldown 4x12, seated cable row wide grip 4x12, EZ bar preacher curl 4x12, standing dumbbell hammer curl 4x12' },
            { day: '2', value: 'Chest + Triceps - incline barbell bench press 4x12, decline barbell bench press 4x12, dumbbell fly 4x12, standing cable tricep pushdown straight bar 4x12, seated dumbbell overhead tricep extensions 4x12' },
            { day: '3', value: 'Shoulders + Traps - seated barbell overhead press 4x12, seated dumbbell lateral raise 3x12, rear delt machine 4x12, standing dumbbell shrugs 5x12' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x12-15, goblet squat 4x12-15, barbell hip thrust 4x12-15, seated calf raise machine 4x12-15, situps 4x12, hanging leg raise 4x12' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 41
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - deadlifts 5x12, wide grip pull up 4x12, neutral grip pull up 4x12, bent over barbell row 4x12, concentration curl 4x12, H bar preacher curl 4x12' },
            { day: '2', value: 'Chest + Triceps - push up 5x12-15, incline dumbbell bench press 4x12, chest fly machine 4x12, dips 3x10-12, dumbbell skull crusher 4x12, bench dips 4x12' },
            { day: '3', value: 'Shoulders + Traps - seated barbell overhead press 4x12, barbell upright row 4x12, rear delt machine 4x12, standing dumbbell shrugs 4x12' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x12-15, standing cable hip extension 4x12-15, barbell glute bridge 4x12-15, seated calf raise machine 4x12-15, smith machine standing calf raise 4x12-15, crunches 4x12, hanging leg raise 4x12' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 42
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - overhand grip lat pulldown 4x8-10, single arm dumbbell row 4x8-10, seated cable row neutral grip 4x8-10, standing dumbbell curl 4x8-10, standing dumbbell hammer curl 4x8-10' },
            { day: '2', value: 'Chest + Triceps - barbell bench press 4x8-10, incline dumbbell bench press 4x8-10, medium cable fly 3x8-10, standing cable tricep pushdown rope 4x8-10, standing dumbbell overhead tricep extensions 4x8-10' },
            { day: '3', value: 'Shoulders + Traps - seated dumbbell overhead press 4x8-10, standing dumbbell lateral raise 4x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 5x8-10,' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x10-12, adduction machine 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12, situps 4x10, russian twist 4x10' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 43
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - wide grip lat pulldown 4x8-10, neutral grip lat pulldown 4x8-10, seated cable row wide grip 4x8-10, EZ bar preacher curl 4x8-10, standing dumbbell hammer curl 4x8-10' },
            { day: '2', value: 'Chest + Triceps - incline barbell bench press 4x8-10, decline barbell bench press 4x8-10, dumbbell fly 4x8-10, standing cable tricep pushdown straight bar 4x8-10, seated dumbbell overhead tricep extensions 4x8-10' },
            { day: '3', value: 'Shoulders + Traps - seated barbell overhead press 4x8-10, seated dumbbell lateral raise 3x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 5x8-10' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x10-12, goblet squat 4x10-12, barbell hip thrust 4x10-12, seated calf raise machine 4x10-12, situps 4x10, hanging leg raise 4x10' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 44
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '4-5' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Back + Biceps - deadlifts 5x8-10, wide grip pull up 4x8-10, neutral grip pull up 4x8-10, bent over barbell row 4x8-10, concentration curl 4x8-10, H bar preacher curl 4x8-10' },
            { day: '2', value: 'Chest + Triceps - push up 5x10-12, incline dumbbell bench press 4x8-10, chest fly machine 4x8-10, dips 3x8-10, dumbbell skull crusher 4x8-10, bench dips 4x8-10' },
            { day: '3', value: 'Shoulders + Traps - seated barbell overhead press 4x8-10, barbell upright row 4x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 4x8-10' },
            { day: '4', value: 'Legs + Abs - barbell back squat 4x10-12, standing cable hip extension 4x10-12, barbell glute bridge 4x10-12, seated calf raise machine 4x10-12, smith machine standing calf raise 4x10-12, crunches 4x10, hanging leg raise 4x10' },
            { day: '5', value: 'Cardio (Optional)' }
        ]
    }, // 45
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Back - overhand grip lat pulldown 4x15, neutral grip lat pulldown 4x15, single arm dumbbell row 4x15, seated cable row neutral grip 4x15' },
            { day: '2', value: 'Chest - barbell bench press 4x15, incline dumbbell bench press 4x15, selector chest press machine 4x15, medium cable fly 4x15' },
            { day: '3', value: 'Arms - standing dumbbell curl 4x15, standing dumbbell hammer curl 4x15, standing cable tricep pushdown rope 4x15, standing dumbbell overhead tricep extensions 4x15' },
            { day: '4', value: 'Legs - barbell back squat 4x15-18, barbell hip thrust 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18' },
            { day: '5', value: 'Shoulders - seated dumbbell overhead press 4x15, standing dumbbell lateral raise 4x15, rear delt machine 4x15, standing dumbbell shrugs 5x15' },
            { day: '6', value: 'Abs - v-ups 4x15, russian twist 4x15, hanging knee raise 4x15, standing dumbbell side bend 4x15' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 46
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Back - wide grip lat pulldown 4x15, neutral grip lat pulldown 4x15, seated cable row wide grip 4x15, TBar row 4x15' },
            { day: '2', value: 'Chest - incline barbell bench press 4x15, decline barbell bench press 4x15, dumbbell bench press 4x15, dumbbell fly 4x15' },
            { day: '3', value: 'Arms - EZ bar preacher curl 4x15, standing dumbbell hammer curl 4x15, standing cable tricep pushdown straight bar 4x15, seated dumbbell overhead tricep extensions 4x15' },
            { day: '4', value: 'Legs - barbell back squat 4x15-18, barbell hip thrust 4x15-18, leg extension 4x15-18, seated calf raise machine 4x15-18' },
            { day: '5', value: 'Shoulders - seated barbell overhead press 4x15, seated dumbbell lateral raise 4x15, rear delt machine 4x15, standing dumbbell shrugs 5x15' },
            { day: '6', value: 'Abs - v-ups 4x15, russian twist 4x15, hanging knee raise 4x15, standing dumbbell side bend 4x15' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 47
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'weight loss' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Back - deadlifts 5x15, wide grip pull up 4x15, neutral grip pull up 4x15, bent over barbell row 4x15' },
            { day: '2', value: 'Chest - push up 5x15-18, incline dumbbell bench press 4x15, chest fly machine 4x15, dips 3x12-15' },
            { day: '3', value: 'Arms - concentration curl 4x15, H bar preacher curl 4x15, dumbbell skull crusher 4x15, bench dips 4x15' },
            { day: '4', value: 'Legs - barbell back squat 4x15-18, barbell glute bridge 4x15-18, standing cable hip extension 4x15-18, seated calf raise machine 4x15-18, smith machine standing calf raise 4x15-18' },
            { day: '5', value: 'Shoulders - seated barbell overhead press 4x15, barbell upright row 4x15, rear delt machine 4x15, standing dumbbell shrugs 4x15' },
            { day: '6', value: 'Abs - decline situps 4x15, abs machine 4x15, lying leg raise 4x15, decline russian twist 4x15' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 48
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Back - overhand grip lat pulldown 4x12, neutral grip lat pulldown 4x12, single arm dumbbell row 4x12, seated cable row neutral grip 4x12' },
            { day: '2', value: 'Chest - barbell bench press 4x12, incline dumbbell bench press 4x12, selector chest press machine 4x12, medium cable fly 4x12' },
            { day: '3', value: 'Arms - standing dumbbell curl 4x12, standing dumbbell hammer curl 4x12, standing cable tricep pushdown rope 4x12, standing dumbbell overhead tricep extensions 4x12' },
            { day: '4', value: 'Legs - barbell back squat 4x12-15, barbell hip thrust 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15' },
            { day: '5', value: 'Shoulders - seated dumbbell overhead press 4x12, standing dumbbell lateral raise 4x12, rear delt machine 4x12, standing dumbbell shrugs 5x12' },
            { day: '6', value: 'Abs - v-ups 4x12, russian twist 4x12, hanging knee raise 4x12, standing dumbbell side bend 4x12' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 49
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Back - wide grip lat pulldown 4x12, neutral grip lat pulldown 4x12, seated cable row wide grip 4x12, TBar row 4x12' },
            { day: '2', value: 'Chest - incline barbell bench press 4x12, decline barbell bench press 4x12, dumbbell bench press 4x12, dumbbell fly 4x12' },
            { day: '3', value: 'Arms - EZ bar preacher curl 4x12, standing dumbbell hammer curl 4x12, standing cable tricep pushdown straight bar 4x12, seated dumbbell overhead tricep extensions 4x12' },
            { day: '4', value: 'Legs - barbell back squat 4x12-15, barbell hip thrust 4x12-15, leg extension 4x12-15, seated calf raise machine 4x12-15' },
            { day: '5', value: 'Shoulders - seated barbell overhead press 4x12, seated dumbbell lateral raise 4x12, rear delt machine 4x12, standing dumbbell shrugs 5x12' },
            { day: '6', value: 'Abs - v-ups 4x12, russian twist 4x12, hanging knee raise 4x12, standing dumbbell side bend 4x12' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 50
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'stay fit' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Back - deadlifts 5x12, wide grip pull up 4x12, neutral grip pull up 4x12, bent over barbell row 4x12' },
            { day: '2', value: 'Chest - push up 5x12-15, incline dumbbell bench press 4x12, chest fly machine 4x12, dips 3x10-12' },
            { day: '3', value: 'Arms - concentration curl 4x12, H bar preacher curl 4x12, dumbbell skull crusher 4x12, bench dips 4x12' },
            { day: '4', value: 'Legs - barbell back squat 4x12-15, barbell glute bridge 4x12-15, standing cable hip extension 4x12-15, seated calf raise machine 4x12-15, smith machine standing calf raise 4x12-15' },
            { day: '5', value: 'Shoulders - seated barbell overhead press 4x12, barbell upright row 4x12, rear delt machine 4x12, standing dumbbell shrugs 4x12' },
            { day: '6', value: 'Abs - decline situps 4x12, abs machine 4x12, lying leg raise 4x12, decline russian twist 4x12' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 51
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'begginer' }
        ],
        conclusion: [
            { day: '1', value: 'Back - overhand grip lat pulldown 4x8-10, neutral grip lat pulldown 4x8-10, single arm dumbbell row 4x8-10, seated cable row neutral grip 4x8-10' },
            { day: '2', value: 'Chest - barbell bench press 4x8-10, incline dumbbell bench press 4x8-10, selector chest press machine 4x8-10, medium cable fly 4x8-10' },
            { day: '3', value: 'Arms - standing dumbbell curl 4x8-10, standing dumbbell hammer curl 4x8-10, standing cable tricep pushdown rope 4x8-10, standing dumbbell overhead tricep extensions 4x8-10' },
            { day: '4', value: 'Legs - barbell back squat 4x10-12, barbell hip thrust 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12' },
            { day: '5', value: 'Shoulders - seated dumbbell overhead press 4x8-10, standing dumbbell lateral raise 4x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 5x8-10' },
            { day: '6', value: 'Abs - v-ups 4x8-10, russian twist 4x8-10, hanging knee raise 4x8-10, standing dumbbell side bend 4x8-10' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 52
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'intermediate' }
        ],
        conclusion: [
            { day: '1', value: 'Back - wide grip lat pulldown 4x8-10, neutral grip lat pulldown 4x8-10, seated cable row wide grip 4x8-10, TBar row 4x8-10' },
            { day: '2', value: 'Chest - incline barbell bench press 4x8-10, decline barbell bench press 4x8-10, dumbbell bench press 4x8-10, dumbbell fly 4x8-10' },
            { day: '3', value: 'Arms - EZ bar preacher curl 4x8-10, standing dumbbell hammer curl 4x8-10, standing cable tricep pushdown straight bar 4x8-10, seated dumbbell overhead tricep extensions 4x8-10' },
            { day: '4', value: 'Legs - barbell back squat 4x10-12, barbell hip thrust 4x10-12, leg extension 4x10-12, seated calf raise machine 4x10-12' },
            { day: '5', value: 'Shoulders - seated barbell overhead press 4x8-10, seated dumbbell lateral raise 4x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 5x8-10' },
            { day: '6', value: 'Abs - v-ups 4x8-10, russian twist 4x8-10, hanging knee raise 4x8-10, standing dumbbell side bend 4x8-10' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 53
    {
        premises: [
            { attribute: 'gender', value: 'f' },
            { attribute: 'goal', value: 'muscle growth' },
            { attribute: 'occurence', value: '6-7' },
            { attribute: 'experience', value: 'advanced' }
        ],
        conclusion: [
            { day: '1', value: 'Back - deadlifts 5x8-10, wide grip pull up 4x8-10, neutral grip pull up 4x8-10, bent over barbell row 4x8-10' },
            { day: '2', value: 'Chest - push up 5x10-12, incline dumbbell bench press 4x8-10, chest fly machine 4x8-10, dips 3x10' },
            { day: '3', value: 'Arms - concentration curl 4x8-10, H bar preacher curl 4x8-10, dumbbell skull crusher 4x8-10, bench dips 4x8-10' },
            { day: '4', value: 'Legs - barbell back squat 4x10-12, barbell glute bridge 4x10-12, standing cable hip extension 4x10-12, seated calf raise machine 4x10-12, smith machine standing calf raise 4x10-12' },
            { day: '5', value: 'Shoulders - seated barbell overhead press 4x8-10, barbell upright row 4x8-10, rear delt machine 4x8-10, standing dumbbell shrugs 4x8-10' },
            { day: '6', value: 'Abs - decline situps 4x8-10, abs machine 4x8-10, lying leg raise 4x8-10, decline russian twist 4x8-10' },
            { day: '7', value: 'Cardio (Optional)' }
        ]
    }, // 54

];

export default data;