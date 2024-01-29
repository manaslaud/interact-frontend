import Links from '@/components/utils/edit_links';
import Tags from '@/components/utils/edit_tags';
import CoverPic from '@/components/utils/new_cover';
import { SERVER_ERROR } from '@/config/errors';
import { ORG_URL, USER_PROFILE_PIC_URL } from '@/config/routes';
import getHandler from '@/handlers/get_handler';
import postHandler from '@/handlers/post_handler';
import { currentOrgSelector } from '@/slices/orgSlice';
import { setOwnerProjects, userSelector } from '@/slices/userSlice';
import { OrganizationMembership, Project, User } from '@/types';
import categories from '@/utils/categories';
import Toaster from '@/utils/toaster';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Image from 'next/image';
import { PROJECT_EDITOR, PROJECT_MANAGER, PROJECT_MEMBER } from '@/config/constants';
import { Id } from 'react-toastify';

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  setProjects?: React.Dispatch<React.SetStateAction<Project[]>>;
}

interface UserSlice {
  userID: string;
  role: string;
  title: string;
}

const NewProject = ({ setShow, setProjects }: Props) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagline, setTagline] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [image, setImage] = useState<File>();

  const [step, setStep] = useState(0);

  const [memberships, setMemberships] = useState<OrganizationMembership[]>([]);

  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [userSlices, setUserSlices] = useState<UserSlice[]>([]);

  const [clickedUserSliceIndex, setClickedUserSliceIndex] = useState(-1);

  const [mutex, setMutex] = useState(false);

  const user = useSelector(userSelector);

  const dispatch = useDispatch();

  const currentOrg = useSelector(currentOrgSelector);

  const getMemberships = async () => {
    const URL = `${ORG_URL}/${currentOrg.id}/membership`;
    const res = await getHandler(URL);

    if (res.statusCode === 200) {
      const membershipData: OrganizationMembership[] = res.data.organization?.memberships || [];
      setMemberships(membershipData);
      setUsers(membershipData.map(m => m.user));
    } else {
      if (res.data.message) Toaster.error(res.data.message, 'error_toaster');
      else {
        Toaster.error(SERVER_ERROR, 'error_toaster');
      }
    }
  };

  const addMembers = async (toaster: Id, projectID: string) => {
    if (userSlices.length == 0) {
      Toaster.stopLoad(toaster, 'Project Added!', 1);
      return;
    }

    const URL = `${ORG_URL}/${currentOrg.id}/project/membership/initial/${projectID}`;

    const res = await postHandler(URL, { userSlices });

    if (res.statusCode === 200) {
      Toaster.stopLoad(toaster, 'Project Added!', 1);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else Toaster.stopLoad(toaster, SERVER_ERROR, 0);
    }
  };

  const [randomImage, setRandomImage] = useState(`default_${Math.floor(Math.random() * 9) + 1}.jpg`);

  const handleSubmit = async () => {
    if (title.trim() == '') {
      Toaster.error('Title cannot be empty');
      return;
    }
    if (category.trim() == '' || category == 'Select Category') {
      Toaster.error('Select Category');
      return;
    }
    if (tagline.trim() == '') {
      Toaster.error('Tagline cannot be empty');
      return;
    }
    if (description.trim() == '') {
      Toaster.error('Description cannot be empty');
      return;
    }
    if (tags.length < 3) {
      Toaster.error('Enter at least 3 tags');
      return;
    }

    if (mutex) return;
    setMutex(true);

    const toaster = Toaster.startLoad('Adding your project...');

    const formData = new FormData();

    formData.append('title', title);
    formData.append('tagline', tagline);
    formData.append('description', description);
    tags.forEach(tag => formData.append('tags', tag));
    links.forEach(link => formData.append('links', link));
    formData.append('category', category);
    formData.append('isPrivate', String(isPrivate));

    if (image) formData.append('coverPic', image);
    else formData.append('coverPic', randomImage);

    const URL = `${ORG_URL}/${currentOrg.id}/projects`;

    const res = await postHandler(URL, formData, 'multipart/form-data');

    if (res.statusCode === 201) {
      const project = res.data.project;
      project.user = user;
      if (setProjects) setProjects(prev => [project, ...prev]);
      setTitle('');
      setTagline('');
      setDescription('');
      setTags([]);
      setLinks([]);
      setImage(undefined);
      if (currentOrg.userID == user.id) dispatch(setOwnerProjects([...user.ownerProjects, project.id]));

      await addMembers(toaster, project.id);
      setShow(false);
    } else if (res.statusCode == 413) {
      Toaster.stopLoad(toaster, 'Image too large', 0);
    } else {
      if (res.data.message) Toaster.stopLoad(toaster, res.data.message, 0);
      else {
        Toaster.stopLoad(toaster, SERVER_ERROR, 0);
      }
    }
    setMutex(false);
  };

  const fetchUsers = async (key: string) => {
    const matchedUsers: User[] = [];
    memberships.forEach(membership => {
      if (membership.user.username.match(new RegExp(key, 'i'))) matchedUsers.push(membership.user);
      else if (membership.user.name.match(new RegExp(key, 'i'))) matchedUsers.push(membership.user);
    });
    setUsers(matchedUsers);
  };

  const handleChange = (el: React.ChangeEvent<HTMLInputElement>) => {
    fetchUsers(el.target.value);
    setSearch(el.target.value);
  };

  const handleClickUser = (user: User) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(prev => prev.filter(u => u.id != user.id));
      setUserSlices(prev => prev.filter(u => u.userID != user.id));
    } else {
      setSelectedUsers(prev => [...prev, user]);
      setUserSlices(prev => [...prev, { userID: user.id, title: '', role: PROJECT_MEMBER }]);
    }
  };

  useEffect(() => {
    getMemberships();

    document.documentElement.style.overflowY = 'hidden';
    document.documentElement.style.height = '100vh';

    return () => {
      document.documentElement.style.overflowY = 'auto';
      document.documentElement.style.height = 'auto';
    };
  }, []);

  return (
    <>
      <div className="fixed top-1/2 -translate-y-1/2 max-lg:top-0 w-5/6 max-lg:w-screen h-5/3 max-h-[90%] max-lg:h-screen backdrop-blur-2xl bg-white rounded-lg p-8 dark:text-white font-primary overflow-y-auto border-[1px] border-primary_btn  dark:border-dark_primary_btn right-1/2 translate-x-1/2 shadow-2xl animate-fade_third z-50">
        <X
          onClick={() => setShow(false)}
          className="lg:hidden absolute top-2 right-2 cursor-pointer"
          weight="bold"
          size={32}
        />
        <div className="w-full h-full flex flex-col gap-4 justify-between">
          {step == 0 ? (
            <div className="w-full flex max-lg:flex-col justify-between gap-8 max-lg:gap-4 ">
              <div className="w-80 max-lg:w-full lg:sticky lg:top-0">
                <CoverPic setSelectedFile={setImage} initialImage={randomImage} />
              </div>
              <div className="w-[calc(100%-320px)] max-lg:w-full h-full flex flex-col justify-between gap-2">
                <div className="w-full h-fit flex flex-col gap-6">
                  <div className="w-full max-lg:w-full text-primary_black flex flex-col gap-4 pb-8 max-lg:pb-4">
                    <input
                      value={title}
                      onChange={el => setTitle(el.target.value)}
                      maxLength={20}
                      type="text"
                      placeholder="Untitled Project"
                      className="w-full text-5xl max-lg:text-center max-lg:text-3xl font-bold bg-transparent focus:outline-none"
                    />

                    <select
                      onChange={el => setCategory(el.target.value)}
                      className="w-1/2 max-lg:w-full h-12 border-[1px] border-primary_btn  dark:border-dark_primary_btn dark:text-white bg-primary_comp dark:bg-[#10013b30] focus:outline-nonetext-sm rounded-lg block p-2"
                    >
                      {categories.map((c, i) => {
                        return (
                          <option className="bg-primary_comp_hover dark:bg-[#10013b30]" key={i} value={c}>
                            {c}
                          </option>
                        );
                      })}
                    </select>

                    <div>
                      <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                        Project Tagline ({tagline.trim().length}/40)
                      </div>
                      <input
                        value={tagline}
                        onChange={el => setTagline(el.target.value)}
                        maxLength={40}
                        type="text"
                        className="w-full font-medium bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
                        placeholder="Write your Tagline here..."
                      />
                    </div>

                    <div>
                      <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                        Project Description ({description.trim().length}/1000)
                      </div>
                      <textarea
                        value={description}
                        onChange={el => setDescription(el.target.value)}
                        maxLength={1000}
                        className="w-full min-h-[80px] max-h-80 bg-transparent focus:outline-none border-[1px] border-gray-400 rounded-lg p-2"
                        placeholder="Explain your project"
                      />
                    </div>

                    <div>
                      <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                        Project Tags ({tags.length || 0}/10)
                      </div>
                      <Tags tags={tags} setTags={setTags} maxTags={10} />
                    </div>

                    <div>
                      <div className="text-xs ml-1 font-medium uppercase text-gray-500">
                        Project Links ({links.length || 0}/5)
                      </div>
                      <Links links={links} setLinks={setLinks} maxLinks={5} />
                    </div>

                    <label className="flex w-fit cursor-pointer select-none items-center text-sm gap-2">
                      <div className="font-semibold">Keep this Project Private</div>
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={isPrivate}
                          onChange={() => setIsPrivate(prev => !prev)}
                          className="sr-only"
                        />
                        <div
                          className={`box block h-6 w-10 rounded-full ${
                            isPrivate ? 'bg-blue-300' : 'bg-black'
                          } transition-ease-300`}
                        ></div>
                        <div
                          className={`absolute left-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white transition ${
                            isPrivate ? 'translate-x-full' : ''
                          }`}
                        ></div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : step == 1 ? (
            <div className="w-full flex flex-col items-center gap-4 ">
              <div className="w-full text-3xl max-md:text-xl font-semibold">Select Users</div>
              <div className="w-full h-[420px] flex flex-col gap-4">
                <div className="w-full h-12 flex items-center px-4 gap-4 dark:bg-dark_primary_comp_hover rounded-md">
                  <MagnifyingGlass size={24} />
                  <input
                    className="grow bg-transparent focus:outline-none font-medium"
                    placeholder="Search"
                    value={search}
                    onChange={handleChange}
                  />
                </div>
                {users.length == 0 ? (
                  <div className="h-64 text-xl flex-center">No other user in the Organisation :(</div>
                ) : (
                  <div className="w-full flex-1 flex flex-col gap-2 overflow-y-auto">
                    {users.map(user => {
                      return (
                        <div
                          key={user.id}
                          onClick={() => handleClickUser(user)}
                          className={`w-full flex gap-2 rounded-lg p-2 ${
                            selectedUsers.includes(user)
                              ? 'bg-primary_comp_hover dark:bg-dark_primary_comp_active'
                              : 'hover:bg-primary_comp dark:bg-dark_primary_comp dark:hover:bg-dark_primary_comp_hover'
                          } cursor-pointer transition-ease-200`}
                        >
                          <Image
                            crossOrigin="anonymous"
                            width={50}
                            height={50}
                            alt={'User Pic'}
                            src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                            className={'rounded-full w-12 h-12 cursor-pointer border-[1px] border-black'}
                          />
                          <div className="w-[calc(100%-48px)] flex flex-col">
                            <div className="text-lg font-bold">{user.name}</div>
                            <div className="text-sm dark:text-gray-200">@{user.username}</div>
                            {user.tagline && user.tagline != '' ? (
                              <div className="text-sm mt-2">{user.tagline}</div>
                            ) : (
                              <></>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4 ">
              <div className="text-3xl max-md:text-xl font-semibold">Confirm Memberships</div>
              {selectedUsers.length == 0 ? (
                <div className="h-64 text-xl flex-center">Selected users will be shown here :)</div>
              ) : (
                <div className="w-full  h-[420px] flex flex-col gap-2">
                  {selectedUsers.map((user, index) => {
                    return (
                      <div
                        key={user.id}
                        className="w-full flex gap-2 rounded-lg p-2 dark:bg-dark_primary_comp_hover cursor-default transition-ease-200"
                      >
                        <Image
                          crossOrigin="anonymous"
                          width={50}
                          height={50}
                          alt={'User Pic'}
                          src={`${USER_PROFILE_PIC_URL}/${user.profilePic}`}
                          className={'rounded-full w-12 h-12 cursor-pointer border-[1px] border-black'}
                        />
                        <div className="grow flex flex-wrap justify-between items-center">
                          <div className="flex flex-col">
                            <div className="text-lg font-bold">{user.name}</div>
                            <div className="text-sm dark:text-gray-200">@{user.username}</div>
                          </div>
                          {clickedUserSliceIndex == index ? (
                            <form
                              onSubmit={el => {
                                el.preventDefault();
                                setClickedUserSliceIndex(-1);
                              }}
                              className="flex gap-4"
                            >
                              <input
                                type="text"
                                maxLength={25}
                                autoFocus={true}
                                value={userSlices[index].title}
                                onChange={el => {
                                  setUserSlices(prev =>
                                    prev.map((userSlice, i) => {
                                      if (i == index) return { ...userSlice, title: el.target.value };
                                      return userSlice;
                                    })
                                  );
                                }}
                                className="p-2 flex-center border-[1px] border-primary_btn  dark:border-dark_primary_btn dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active focus:outline-none transition-ease-300 cursor-pointer rounded-lg font-medium"
                              />

                              <select
                                onChange={el => {
                                  setUserSlices(u =>
                                    u.map((u, index) => {
                                      if (index == clickedUserSliceIndex) return { ...u, role: el.target.value };
                                      else return u;
                                    })
                                  );
                                }}
                                className="w-1/2 max-lg:w-full h-12 border-[1px] border-primary_btn  dark:border-dark_primary_btn dark:text-white bg-primary_comp dark:bg-[#10013b30] focus:outline-nonetext-sm rounded-lg block p-2"
                              >
                                {[PROJECT_MEMBER, PROJECT_EDITOR, PROJECT_MANAGER].map((c, i) => {
                                  return (
                                    <option className="bg-primary_comp_hover dark:bg-[#10013b30]" key={i} value={c}>
                                      {c}
                                    </option>
                                  );
                                })}
                              </select>
                            </form>
                          ) : (
                            <div onClick={() => setClickedUserSliceIndex(index)} className="flex gap-4">
                              <div className="px-4 py-2 flex-center border-[1px] border-primary_btn  dark:border-dark_primary_btn dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300 cursor-pointer rounded-lg font-medium">
                                {userSlices[index].title == '' ? 'Enter Title' : userSlices[index].title}
                              </div>
                              <div className="px-4 py-2 flex-center border-[1px] border-primary_btn  dark:border-dark_primary_btn dark:bg-dark_primary_comp hover:bg-primary_comp_hover active:bg-primary_comp_active dark:hover:bg-dark_primary_comp_hover dark:active:bg-dark_primary_comp_active transition-ease-300 cursor-pointer rounded-lg font-medium">
                                {userSlices[index].role}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="w-full flex items-end justify-between">
            {step != 0 ? (
              <div
                onClick={() => setStep(prev => prev - 1)}
                className="w-fit text-lg py-2 font-medium px-4 shadow-md hover:bg-[#ffffff40] hover:shadow-lg transition-ease-500 rounded-xl cursor-pointer"
              >
                prev
              </div>
            ) : (
              <div></div>
            )}
            {step != 2 ? (
              <div
                onClick={() => setStep(prev => prev + 1)}
                className="w-fit text-lg py-2 font-medium px-4 shadow-md hover:bg-[#ffffff40] hover:shadow-lg transition-ease-500 rounded-xl cursor-pointer"
              >
                Next
              </div>
            ) : (
              <button
                onClick={handleSubmit}
                className={`duration-300 relative group cursor-pointer text-white overflow-hidden h-14 max-lg:h-12 ${
                  mutex ? 'w-64 max-lg:w-56 scale-90' : 'w-44 max-lg:w-36 hover:scale-90'
                } rounded-xl p-2 flex-center`}
              >
                <div
                  className={`absolute right-32 -top-4 ${
                    mutex
                      ? 'top-0 right-2 scale-150'
                      : 'scale-125 group-hover:top-1 group-hover:right-2 group-hover:scale-150'
                  } z-10 w-36 h-36 rounded-full duration-500 bg-[#6661c7]`}
                ></div>
                <div
                  className={`absolute right-2 -top-4 ${
                    mutex
                      ? 'top-1 right-2 scale-150'
                      : 'scale-125 right-3 group-hover:top-1 group-hover:right-2 group-hover:scale-150'
                  } z-10 w-24 h-24 rounded-full duration-500 bg-[#ada9ff]`}
                ></div>
                <div
                  className={`absolute -right-10 top-0 ${
                    mutex ? 'top-1 right-2 scale-150' : 'group-hover:top-1 group-hover:right-2 group-hover:scale-150'
                  } z-10 w-20 h-20 rounded-full duration-500 bg-[#cea9ff]`}
                ></div>
                <div
                  className={`absolute right-20 -top-4 ${
                    mutex ? 'top-1 right-2 scale-125' : 'group-hover:top-1 group-hover:right-2 group-hover:scale-125'
                  } z-10 w-16 h-16 rounded-full duration-500 bg-[#df96ff]`}
                ></div>
                <div
                  className={`w-[96%] h-[90%] bg-gray-50 ${
                    mutex ? 'opacity-100' : 'opacity-0'
                  } absolute rounded-xl z-10 transition-ease-500`}
                ></div>
                <p className={`z-10 font-bold text-xl max-lg:text-lg transition-ease-500`}>
                  {mutex ? (
                    <>
                      <div className="w-fit text-gradient transition-ease-out-300 animate-fade_half">
                        Building your project!
                      </div>
                    </>
                  ) : (
                    <div className="">Build Project</div>
                  )}
                </p>
              </button>
            )}
          </div>
        </div>
      </div>
      <div
        onClick={() => setShow(false)}
        className="bg-backdrop w-screen h-screen max-lg:w-[105vw] max-lg:h-[105vh] fixed top-0 left-0 animate-fade_third z-20"
      ></div>
    </>
  );
};

export default NewProject;
