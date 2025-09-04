// // app/api/therapists/[tid]/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { supabase } from '@/lib/supabaseClient'

// export async function GET(
//   context: { params: Promise<{ tid: string }> }
// ) {
//   try {
//     const params = await context.params;
//     const tid = params.tid;

//     // Fetch therapist details - removed authentication check for public viewing
//     const { data: therapist, error: fetchError } = await supabase
//       .from('therapists')
//       .select(`
//         tid,
//         name,
//         email,
//         education,
//         bio,
//         areas_covered,
//         languages,
//         Why_counselling,
//         One_thing,
//         expect,
//         selfcare_tips,
//         image_data
//       `)
//       .eq('tid', tid)
//       .single()

//     if (fetchError) {
//       if (fetchError.code === 'PGRST116') {
//         return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
//       }
//       throw fetchError
//     }

//     // Convert image data to base64 if it exists
//     let imageUrl = null;
//     if (therapist.image_data) {
//       // Convert bytea to base64 string
//       const base64String = Buffer.from(therapist.image_data).toString('base64');
//       imageUrl = `data:image/jpeg;base64,${base64String}`;
//     }

//     // Return therapist data with processed image
//     const therapistData = {
//       ...therapist,
//       image: imageUrl || '/images/therapist_placeholder.jpg'
//     };

//     return NextResponse.json({ therapist: therapistData }, { status: 200 })
//   } catch (error: any) {
//     console.error('Error fetching therapist:', error)
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }

// export async function PUT(
//   req: NextRequest,
//   context: { params: Promise<{ tid: string }> }
// ) {
//   try {
//     const params = await context.params;
//     const tid = params.tid;
    
//     const updateData = await req.json();
    
//     // Validate required fields
//     if (!updateData.name || !updateData.email) {
//       return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
//     }

//     // Update therapist profile in database
//     const { data: updatedTherapist, error: updateError } = await supabase
//       .from('therapists')
//       .update({
//         name: updateData.name,
//         email: updateData.email,
//         education: updateData.education,
//         bio: updateData.bio,
//         languages: updateData.languages,
//         areas_covered: updateData.areas_covered,
//         Why_counselling: updateData.Why_counselling,
//         One_thing: updateData.One_thing,
//         expect: updateData.expect,
//         selfcare_tips: updateData.selfcare_tips,
//       })
//       .eq('tid', tid)
//       .select()
//       .single()

//     if (updateError) {
//       console.error('Error updating therapist:', updateError)
//       return NextResponse.json({ error: updateError.message }, { status: 500 })
//     }

//     return NextResponse.json({ 
//       message: 'Profile updated successfully', 
//       therapist: updatedTherapist 
//     }, { status: 200 })

//   } catch (error: any) {
//     console.error('Error updating therapist profile:', error)
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }
// {/* 
// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ tid: string }> }
// ) {
//   try {{
//     // Auth check
//     const authHeader = req.headers.get('authorization')
//     if (!authHeader) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }
//     const token = authHeader.split(' ')[1]
//     const { data: { user }, error: authError } = await supabase.auth.getUser(token)
//     if (authError || !user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const params = await context.params
//     const tid = params.tid

//     // Validate UUID format
//     const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
//     if (!uuidRegex.test(tid)) {
//       return NextResponse.json({ error: 'Invalid therapist ID format' }, { status: 400 })
//     }


//     // Fetch therapist to check ownership
//     const params = await context.params;
//     const tid = params.tid;

//     const { data: therapist, error: fetchError } = await supabase
//       .from('therapists')
//       .select(' tid, name,education,bio,areas_covered, languages, Why_counselling,One_thing,expect, image_data')
//     .eq('tid', tid)
//       .single()

//     if (fetchError) {
//       if (fetchError.code === 'PGRST116') {
//         return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
//       }
//       throw fetchError
//     }

//     if (therapist.user_id !== user.id) {
//       return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
//     }

//     return NextResponse.json({ therapist }, { status: 200 })
//   } catch (error: any) {
//     console.error('Error fetching therapist:', error)
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }
// */}
// {/* 
// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ tid: string }> }
// ) {
//   try {
//     const params = await context.params;
//     const tid = params.tid;

//     // Fetch therapist details - removed authentication check for public viewing
//     const { data: therapist, error: fetchError } = await supabase
//       .from('therapists')
//       .select(`
//         tid,
//         name,
//         education,
//         bio,
//         areas_covered,
//         languages,
//         Why_counselling,
//         One_thing,
//         expect,
//         selfcare_tips,
//         image_data
//       `)
//       .eq('tid', tid)
//       .single()

//     if (fetchError) {
//       if (fetchError.code === 'PGRST116') {
//         return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
//       }
//       throw fetchError
//     }

//     // Convert image data to base64 if it exists
//     let imageUrl = null;
//     if (therapist.image_data) {
//       // Convert bytea to base64 string
//       const base64String = Buffer.from(therapist.image_data).toString('base64');
//       imageUrl = `data:image/jpeg;base64,${base64String}`;
//     }

//     // Return therapist data with processed image
//     const therapistData = {
//       ...therapist,
//       image: imageUrl || '/images/therapist_placeholder.jpg'
//     };

//     return NextResponse.json({ therapist: therapistData }, { status: 200 })
//   } catch (error: any) {
//     console.error('Error fetching therapist:', error)
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }*/}
// export async function DELETE(
//   req: NextRequest,
//   context: { params: Promise<{ tid: string }> }
// ) {
//   try {
//     // Auth check
//     const authHeader = req.headers.get('authorization')
//     if (!authHeader) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }
//     const token = authHeader.split(' ')[1]
//     const { data: { user }, error: authError } = await supabase.auth.getUser(token)
//     if (authError || !user) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//     }

//     const params = await context.params
//     const tid = params.tid

//     // Validate UUID format
//     const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
//     if (!uuidRegex.test(tid)) {
//       return NextResponse.json({ error: 'Invalid therapist ID format' }, { status: 400 })
//     }

//     // Fetch therapist to check ownership
//     const { data: therapist, error: fetchError } = await supabase
//       .from('therapists')
//       .select('user_id')
//       .eq('tid', tid)
//       .single()

//     if (fetchError || !therapist) {
//       return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
//     }

//     if (therapist.user_id !== user.id) {
//       return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
//     }

//     const { error } = await supabase
//       .from('therapists')
//       .delete()
//       .eq('tid', tid)

//     if (error) throw error

//     return NextResponse.json({ 
//       message: `Therapist ${tid} deleted successfully` 
//     }, { status: 200 })
//   } catch (error: any) {
//     console.error('Error deleting therapist:', error)
//     return NextResponse.json({ error: error.message }, { status: 500 })
//   }
// }

// app/api/therapists/[tid]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ tid: string }> }
) {
  try {
    const params = await context.params;
    const tid = params.tid;

    let isOwner = false;
    const authHeader = req.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const { data: { user }, error: authError } = await supabase.auth.getUser(token);
      if (!authError && user) {
        const { data: therapistUser, error: ownerError } = await supabase
          .from('therapists')
          .select('user_id')
          .eq('tid', tid)
          .single();
        if (!ownerError && therapistUser && therapistUser.user_id === user.id) {
          isOwner = true;
        }
      }
    }

    let selectFields = `
      tid,
      name,
      email,
      education,
      bio,
      areas_covered,
      languages,
      Why_counselling,
      One_thing,
      expect,
      selfcare_tips,
      image_data
    `;
    if (isOwner) {
      selectFields += `,
        availability_hours
      `;
    }

    const { data: therapist, error: fetchError } = await supabase
      .from('therapists')
      .select(selectFields)
      .eq('tid', tid)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
      }
      throw fetchError
    }

    // Convert image data to base64 if it exists
    let imageUrl = null;
    if (therapist.image_data) {
      const base64String = Buffer.from(therapist.image_data).toString('base64');
      imageUrl = `data:image/jpeg;base64,${base64String}`;
    }

    // Return therapist data with processed image
    const therapistData = {
      ...therapist,
      image: imageUrl || '/images/therapist_placeholder.jpg'
    };

    if (isOwner) {
      const { data: schedules, error: schedError } = await supabase
        .from('therapist_schedule')
        .select('schedule_id, day_of_week, start_time, end_time')
        .eq('tid', tid)
        .order('day_of_week, start_time');

      if (schedError) throw schedError;

      const availability: WeeklyAvailability = {
        monday: { isAvailable: false, timeSlots: [] },
        tuesday: { isAvailable: false, timeSlots: [] },
        wednesday: { isAvailable: false, timeSlots: [] },
        thursday: { isAvailable: false, timeSlots: [] },
        friday: { isAvailable: false, timeSlots: [] },
        saturday: { isAvailable: false, timeSlots: [] },
        sunday: { isAvailable: false, timeSlots: [] },
        maxHoursPerWeek: therapist.availability_hours || 0,
      };

      const dayMap: { [key: number]: keyof Omit<WeeklyAvailability, 'maxHoursPerWeek'> } = {
        1: 'monday',
        2: 'tuesday',
        3: 'wednesday',
        4: 'thursday',
        5: 'friday',
        6: 'saturday',
        7: 'sunday',
      };

      schedules.forEach((sched) => {
        const dayKey = dayMap[sched.day_of_week];
        if (dayKey) {
          availability[dayKey].isAvailable = true;
          availability[dayKey].timeSlots.push({
            start: sched.start_time.slice(0, 5),
            end: sched.end_time.slice(0, 5),
          });
        }
      });

      therapistData.availability = availability;
    }

    return NextResponse.json({ therapist: therapistData }, { status: 200 })
  } catch (error: any) {
    console.error('Error fetching therapist:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ tid: string }> }
) {
  try {
    const params = await context.params;
    const tid = params.tid;

    // Auth check
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check ownership
    const { data: therapistOwner, error: fetchError } = await supabase
      .from('therapists')
      .select('user_id')
      .eq('tid', tid)
      .single()

    if (fetchError || !therapistOwner) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }

    if (therapistOwner.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const updateData = await req.json();

    // Therapist profile updates
    const therapistUpdates: any = {};
    if (updateData.name) therapistUpdates.name = updateData.name;
    if (updateData.email) therapistUpdates.email = updateData.email;
    if (updateData.education) therapistUpdates.education = updateData.education;
    if (updateData.bio) therapistUpdates.bio = updateData.bio;
    if (updateData.languages) therapistUpdates.languages = updateData.languages;
    if (updateData.areas_covered) therapistUpdates.areas_covered = updateData.areas_covered;
    if (updateData.Why_counselling) therapistUpdates.Why_counselling = updateData.Why_counselling;
    if (updateData.One_thing) therapistUpdates.One_thing = updateData.One_thing;
    if (updateData.expect) therapistUpdates.expect = updateData.expect;
    if (updateData.selfcare_tips) therapistUpdates.selfcare_tips = updateData.selfcare_tips;
    if (updateData.availability_hours !== undefined) therapistUpdates.availability_hours = updateData.availability_hours;

    if (Object.keys(therapistUpdates).length > 0) {
      const { error: therapistError } = await supabase
        .from('therapists')
        .update(therapistUpdates)
        .eq('tid', tid);
      if (therapistError) throw therapistError;
    }

    // Handle availability slots if provided
    if (updateData.availability) {
      // Delete existing schedules
      const { error: deleteError } = await supabase
        .from('therapist_schedule')
        .delete()
        .eq('tid', tid);
      if (deleteError) throw deleteError;

      // Day mapping: assuming 1=Monday ... 7=Sunday
      const dayMap: { [key: string]: number } = {
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 7,
      };

      // Insert new schedules
      const newSchedules = [];
      for (const [dayKey, dayAvail] of Object.entries(updateData.availability)) {
        if (dayKey === 'maxHoursPerWeek') continue;
        if (dayAvail.isAvailable) {
          const dayNum = dayMap[dayKey];
          for (const slot of dayAvail.timeSlots) {
            newSchedules.push({
              tid: tid,
              day_of_week: dayNum,
              start_time: `${slot.start}:00`,
              end_time: `${slot.end}:00`,
            });
          }
        }
      }

      if (newSchedules.length > 0) {
        const { error: insertError } = await supabase
          .from('therapist_schedule')
          .insert(newSchedules);
        if (insertError) throw insertError;
      }
    }

    // Fetch updated therapist (similar to GET for consistency)
    const { data: updatedTherapist, error: selectError } = await supabase
      .from('therapists')
      .select(`
        tid,
        name,
        email,
        education,
        bio,
        areas_covered,
        languages,
        Why_counselling,
        One_thing,
        expect,
        selfcare_tips,
        image_data,
        availability_hours
      `)
      .eq('tid', tid)
      .single();

    if (selectError) throw selectError;

    // Convert image data to base64 if it exists
    let imageUrl = null;
    if (updatedTherapist.image_data) {
      const base64String = Buffer.from(updatedTherapist.image_data).toString('base64');
      imageUrl = `data:image/jpeg;base64,${base64String}`;
    }

    const therapistData = {
      ...updatedTherapist,
      image: imageUrl || '/images/therapist_placeholder.jpg'
    };

    // Include availability for owner
    const { data: schedules, error: schedError } = await supabase
      .from('therapist_schedule')
      .select('schedule_id, day_of_week, start_time, end_time')
      .eq('tid', tid)
      .order('day_of_week, start_time');

    if (schedError) throw schedError;

    const availability: WeeklyAvailability = {
      monday: { isAvailable: false, timeSlots: [] },
      tuesday: { isAvailable: false, timeSlots: [] },
      wednesday: { isAvailable: false, timeSlots: [] },
      thursday: { isAvailable: false, timeSlots: [] },
      friday: { isAvailable: false, timeSlots: [] },
      saturday: { isAvailable: false, timeSlots: [] },
      sunday: { isAvailable: false, timeSlots: [] },
      maxHoursPerWeek: updatedTherapist.availability_hours || 0,
    };

    const dayMapReverse: { [key: number]: keyof Omit<WeeklyAvailability, 'maxHoursPerWeek'> } = {
      1: 'monday',
      2: 'tuesday',
      3: 'wednesday',
      4: 'thursday',
      5: 'friday',
      6: 'saturday',
      7: 'sunday',
    };

    schedules.forEach((sched) => {
      const dayKey = dayMapReverse[sched.day_of_week];
      if (dayKey) {
        availability[dayKey].isAvailable = true;
        availability[dayKey].timeSlots.push({
          start: sched.start_time.slice(0, 5),
          end: sched.end_time.slice(0, 5),
        });
      }
    });

    therapistData.availability = availability;

    return NextResponse.json({ 
      message: 'Profile updated successfully', 
      therapist: therapistData 
    }, { status: 200 })

  } catch (error: any) {
    console.error('Error updating therapist profile:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ tid: string }> }
) {
  try {
    // Auth check
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const params = await context.params
    const tid = params.tid

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(tid)) {
      return NextResponse.json({ error: 'Invalid therapist ID format' }, { status: 400 })
    }

    // Fetch therapist to check ownership
    const { data: therapist, error: fetchError } = await supabase
      .from('therapists')
      .select('user_id')
      .eq('tid', tid)
      .single()

    if (fetchError || !therapist) {
      return NextResponse.json({ error: 'Therapist not found' }, { status: 404 })
    }

    if (therapist.user_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase
      .from('therapists')
      .delete()
      .eq('tid', tid)

    if (error) throw error

    return NextResponse.json({ 
      message: `Therapist ${tid} deleted successfully` 
    }, { status: 200 })
  } catch (error: any) {
    console.error('Error deleting therapist:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}